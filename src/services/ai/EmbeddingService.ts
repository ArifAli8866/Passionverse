import { tokenizeText, PASSION_TAXONOMY } from "./taxonomy";

export class EmbeddingService {
  private static readonly VECTOR_DIMENSION = 384;
  private static ollamaUrl: string = import.meta.env.VITE_OLLAMA_API_URL || "http://localhost:11434";
  private static ollamaEmbeddingModel: string = "all-minilm";
  private static isOllamaAvailable: boolean | null = null;

  /**
   * Generates a 384-dimensional normalized embedding vector.
   * Attempts local Ollama endpoint first; falls back cleanly to deterministic semantic projection.
   */
  public static async generateEmbedding(text: string): Promise<number[]> {
    if (!text || text.trim().length === 0) {
      return new Array(this.VECTOR_DIMENSION).fill(0);
    }

    // Attempt Ollama if not known to be offline
    if (this.isOllamaAvailable !== false) {
      try {
        const ollamaVector = await this.fetchOllamaEmbedding(text);
        if (ollamaVector && ollamaVector.length > 0) {
          this.isOllamaAvailable = true;
          return this.normalizeVector(ollamaVector.slice(0, this.VECTOR_DIMENSION));
        }
      } catch {
        this.isOllamaAvailable = false;
      }
    }

    // Deterministic semantic embedding fallback (0 network calls, 0 cost, instant)
    return this.generateSemanticFallbackVector(text);
  }

  /**
   * Tries to call Ollama's embeddings API
   */
  private static async fetchOllamaEmbedding(text: string): Promise<number[] | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    try {
      const res = await fetch(`${this.ollamaUrl}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.ollamaEmbeddingModel,
          prompt: text,
        }),
        signal: controller.signal,
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data.embedding || null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Deterministic Semantic Vector Projection
   * Computes a 384-dimensional unit vector using:
   * 1. Taxonomy feature subspace projections
   * 2. Hash-based n-gram latent semantic distributions
   * 3. Word frequency weighting
   */
  public static generateSemanticFallbackVector(text: string): number[] {
    const vector = new Array(this.VECTOR_DIMENSION).fill(0);
    const tokens = tokenizeText(text.toLowerCase());
    if (tokens.length === 0) return vector;

    // 1. Taxonomy Subspace Projection (dimensions 0 - 139)
    PASSION_TAXONOMY.forEach((category, catIdx) => {
      const baseDim = (catIdx * 10) % 140;
      let matchedCount = 0;

      for (const kw of category.keywords) {
        if (text.toLowerCase().includes(kw)) {
          matchedCount++;
          // Project across localized subspace
          for (let offset = 0; offset < 10; offset++) {
            const dim = (baseDim + offset) % this.VECTOR_DIMENSION;
            vector[dim] += (matchedCount * 0.45) / (offset + 1);
          }
        }
      }
    });

    // 2. N-Gram Latent Hash Projection (dimensions 140 - 383)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const weight = 1 / Math.sqrt(i + 1);

      // Single token hash
      const h1 = this.hashString(token);
      const dim1 = 140 + (Math.abs(h1) % (this.VECTOR_DIMENSION - 140));
      const sign1 = h1 % 2 === 0 ? 1 : -1;
      vector[dim1] += sign1 * weight * 0.6;

      // Bigram hash
      if (i < tokens.length - 1) {
        const bigram = `${token}_${tokens[i + 1]}`;
        const h2 = this.hashString(bigram);
        const dim2 = 140 + (Math.abs(h2) % (this.VECTOR_DIMENSION - 140));
        const sign2 = h2 % 2 === 0 ? 1 : -1;
        vector[dim2] += sign2 * weight * 0.8;
      }
    }

    return this.normalizeVector(vector);
  }

  /**
   * Murmur-like deterministic 32-bit string hash
   */
  private static hashString(str: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash;
  }

  /**
   * L2 Vector Normalization to Unit Length (length = 1)
   */
  public static normalizeVector(vector: number[]): number[] {
    let sumSquares = 0;
    for (let i = 0; i < vector.length; i++) {
      sumSquares += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSquares);
    if (norm < 1e-12) return vector;

    const normalized = new Array(vector.length);
    for (let i = 0; i < vector.length; i++) {
      normalized[i] = Number((vector[i] / norm).toFixed(6));
    }
    return normalized;
  }

  /**
   * Computes Cosine Similarity between two vectors
   * Range: 0.0 to 1.0 (assuming non-negative or adjusted dot product)
   */
  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom < 1e-12) return 0;

    // Normalize result between 0 and 1
    const raw = dot / denom;
    return Math.max(0, Math.min(1, (raw + 1) / 2));
  }

  /**
   * Formats vector for Supabase PostgreSQL pgvector column insertion
   */
  public static vectorToSql(vector: number[]): string {
    return `[${vector.join(",")}]`;
  }
}
