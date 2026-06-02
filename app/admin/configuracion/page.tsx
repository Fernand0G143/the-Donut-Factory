"use client";

import { useTheme } from "@/components/ThemeProvider";
import "@/styles/dashboard.css";
import "@/styles/Configuracion.css";

export default function ConfiguracionPage() {
  const { isDark, setTheme } = useTheme();

  function toggleDarkmode(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  return (
    <div className="pagina_configuracion">
      <div className="configuracion_header">
        <div>
          <h1 className="titulo_configuracion">Configuración</h1>
        </div>

        <div className="card_configuracion">
          <span className={`switch_text ${isDark ? 'activo' : ''}`}>Darkmode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDark}
              onChange={(e) => toggleDarkmode(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
