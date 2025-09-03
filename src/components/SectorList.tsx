"use client";

import { useState, useEffect } from "react";

type SectorListProps = {
  onSelect: (sector: string) => void;
  defaultValue?: string; // Valor inicial opcional
};

export default function SectorList({ onSelect, defaultValue = "" }: SectorListProps) {
  const sectores = [
    "Autoridades municipales",
    "Educación media superior",
    "Reclusorios",
    "Gobierno del estado",
    "Gobierno federal",
    "Oficina centrales",
    "Gasolineras",
    "Organizaciones productivas",
    "Empresas",
    "Organizaciones Empresariales",
    "Otros",
  ];

  const [selectedSector, setSelectedSector] = useState("");

  // Cargar valor inicial
  useEffect(() => {
    if (defaultValue && typeof defaultValue === "string") {
      setSelectedSector(defaultValue);
      onSelect(defaultValue);
    }
  }, [defaultValue, onSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <select
      value={selectedSector}
      onChange={handleChange}
      className="border rounded p-2 w-full"
    >
      <option value="">-- Seleccionar sector --</option>
      {sectores.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
