"use client";
import { getSectores } from "@/lib/actions";
//Como no pude meti los sectores manualmente okey
import { useState, useEffect } from "react";

type SectorListProps = {
  onSelect: (sector: string) => void;
  defaultValue?: string; // Valor inicial opcional
};

export default function SectorList({ onSelect, defaultValue = "" }: SectorListProps) {
  const _sectores = [
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
  const [sectores, setSectores] = useState<{id: number, nombre: string}[]>([]);

  // Cargar valor inicial
  useEffect(() => {
    // if (defaultValue && typeof defaultValue === "string") {
      
      setSelectedSector(defaultValue);
      onSelect(defaultValue);
    // }
  }, [defaultValue]);


  useEffect(() => {
    fetchSelectors();
  }, []);

  const fetchSelectors = async () => {
    const response = await getSectores();
    console.log("🚀 ~ response:", response)
    setSectores(response);
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <select
      value={selectedSector}
      onChange={handleChange}
      className="border rounded p-2 w-full bg-green-60/40"
    >
      <option value="">-- Seleccionar sector --</option>
      {sectores.map((selector, index) => (
        <option key={index} value={selector.id}>
          {selector.nombre}
        </option>
      ))}
    </select>
  );
}
