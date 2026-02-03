export const DATABASES = {
  postgresql: {
    name: "PostgreSQL",
    explain_query: "EXPLAIN (ANALYZE, FORMAT JSON, VERBOSE, BUFFERS)\n[your-query]",
    loadExamples: async () => {
      const { default: examples } = await import("./examples/postgresql");
      return examples;
    },
  },
  duckdb: {
    name: "DuckDB",
    explain_query: "EXPLAIN (ANALYZE, FORMAT JSON)\n[your-query]",
    loadExamples: async () => {
      const { default: examples } = await import("./examples/duckdb");
      return examples;
    },
  },
} as const;

export type Databases = typeof DATABASES;
export type DatabaseKey = keyof Databases;
