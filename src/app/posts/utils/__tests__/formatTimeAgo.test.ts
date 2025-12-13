import { formatTimeAgo } from "../formatTimeAgo";

describe("formatTimeAgo", () => {
  beforeEach(() => {
    // Mock de la fecha actual para tests consistentes
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debería retornar "Reciente" para fechas inválidas', () => {
    expect(formatTimeAgo("fecha-invalida")).toBe("Reciente");
    expect(formatTimeAgo("")).toBe("Reciente");
  });

  it("debería formatear segundos correctamente", () => {
    const fechaHace30Segundos = new Date("2024-01-01T11:59:30Z");
    expect(formatTimeAgo(fechaHace30Segundos.toISOString())).toBe("30s");
  });

  it("debería formatear minutos correctamente", () => {
    const fechaHace5Minutos = new Date("2024-01-01T11:55:00Z");
    expect(formatTimeAgo(fechaHace5Minutos.toISOString())).toBe("5m");
  });

  it("debería formatear horas correctamente", () => {
    const fechaHace3Horas = new Date("2024-01-01T09:00:00Z");
    expect(formatTimeAgo(fechaHace3Horas.toISOString())).toBe("3h");
  });

  it("debería formatear días correctamente", () => {
    const fechaHace2Dias = new Date("2023-12-30T12:00:00Z");
    expect(formatTimeAgo(fechaHace2Dias.toISOString())).toBe("2d");
  });

  it("debería manejar fechas con espacio en lugar de T", () => {
    // Usar la fecha mockeada del beforeEach pero en UTC
    const fechaConEspacio = "2024-01-01T11:55:00Z";
    const referencia = new Date("2024-01-01T12:00:00Z");

    expect(formatTimeAgo(fechaConEspacio, referencia)).toBe("5m");
  });

  it("debería manejar fechas futuras", () => {
    const fechaFutura = new Date("2024-01-01T12:05:00Z");
    expect(formatTimeAgo(fechaFutura.toISOString())).toBe("5m");
  });

  it("debería manejar el límite entre segundos y minutos", () => {
    const fechaHace59Segundos = new Date("2024-01-01T11:59:01Z");
    const fechaHace60Segundos = new Date("2024-01-01T11:59:00Z");

    expect(formatTimeAgo(fechaHace59Segundos.toISOString())).toBe("59s");
    expect(formatTimeAgo(fechaHace60Segundos.toISOString())).toBe("1m");
  });

  it("debería manejar el límite entre minutos y horas", () => {
    const fechaHace59Minutos = new Date("2024-01-01T11:01:00Z");
    const fechaHace60Minutos = new Date("2024-01-01T11:00:00Z");

    expect(formatTimeAgo(fechaHace59Minutos.toISOString())).toBe("59m");
    expect(formatTimeAgo(fechaHace60Minutos.toISOString())).toBe("1h");
  });

  it("debería manejar el límite entre horas y días", () => {
    const fechaHace23Horas = new Date("2023-12-31T13:00:00Z");
    const fechaHace24Horas = new Date("2023-12-31T12:00:00Z");

    expect(formatTimeAgo(fechaHace23Horas.toISOString())).toBe("23h");
    expect(formatTimeAgo(fechaHace24Horas.toISOString())).toBe("1d");
  });
});
