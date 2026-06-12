"use client";
import "./UploadBox.css";
import { UploadSimple } from "@phosphor-icons/react";
export default function UploadBox() {
  return (
    <label className="upload-box">
      <input type="file" accept="image/*" hidden />
      <div className="upload-content">
        <div className="upload-icon">
          <UploadSimple size={36} />
        </div>
        <h3>Toca para subir una foto</h3>
        <p>JPG o PNG (máx. 5MB)</p>
      </div>
    </label>
  );
}
