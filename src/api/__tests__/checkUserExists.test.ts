import { checkUserExists } from "../checkUserExists";
import { supabase } from "@/lib/supabase";

// Mock de Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("checkUserExists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería retornar true si el usuario existe", async () => {
    const mockUserData = { id: "user123", email: "test@example.com" };

    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockUserData,
          error: null,
        }),
      }),
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    const result = await checkUserExists("test@example.com");

    expect(result).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith("perfiles");
    expect(mockSelect).toHaveBeenCalledWith("id");
  });

  it("debería retornar false si el usuario no existe", async () => {
    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    const result = await checkUserExists("nonexistent@example.com");

    expect(result).toBe(false);
  });

  it("debería manejar errores de la base de datos", async () => {
    const errorMessage = "Error de base de datos";

    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: errorMessage },
        }),
      }),
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    const result = await checkUserExists("test@example.com");

    expect(result).toBe(false);
  });

  it("debería manejar errores inesperados en el catch", async () => {
    const unexpectedError = new Error("Error inesperado");

    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockRejectedValue(unexpectedError),
      }),
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    const result = await checkUserExists("test@example.com");

    expect(result).toBe(false);
  });

  it("debería usar el email proporcionado en la consulta", async () => {
    const email = "test@example.com";

    const mockEq = jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    await checkUserExists(email);

    expect(mockEq).toHaveBeenCalledWith("id", email);
  });

  it("debería manejar emails vacíos", async () => {
    const mockEq = jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    const result = await checkUserExists("");

    expect(result).toBe(false);
    expect(mockEq).toHaveBeenCalledWith("id", "");
  });

  it("debería manejar emails con espacios", async () => {
    const email = " test@example.com ";
    const mockEq = jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    mockSupabase.from = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    await checkUserExists(email);

    expect(mockEq).toHaveBeenCalledWith("id", email);
  });
});
