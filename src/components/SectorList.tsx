"use client";

import { useState } from "react";

type SectorFilterProps = {
  onSelect: (sector: string) => void;
};

export default function SectorFilter({ onSelect }: SectorFilterProps) {
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

  const handleChange = (sector: string) => {
    setSelectedSector(sector);
    onSelect(sector); // Devuelve el sector seleccionado
  };

  return (
    <select
      className="border rounded p-2"
      value={selectedSector}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Selecciona un sector</option>
      {sectores.map((sec) => (
        <option key={sec} value={sec}>
          {sec}
        </option>
      ))}
    </select>
  );
}
