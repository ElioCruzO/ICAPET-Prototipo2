'use client';
import { getSectores } from '@/lib/actions';
//Como no pude meti los sectores manualmente okey
import { useState, useEffect } from 'react';

type SectorListProps = {
  onSelect: (sector: number) => void;
  defaultValue?: number; // Valor inicial opcional
};

export default function SectorList({
  onSelect,
  defaultValue = 0,
}: SectorListProps) {
  const [selectedSector, setSelectedSector] = useState<number>(0);
  const [sectores, setSectores] = useState<{ id: number; nombre: string }[]>(
    []
  );

  // Fetch de los primeos datos
  useEffect(() => {
    fetchSelectors();
  }, []);

  useEffect(() => {
    setSelectedSector(defaultValue);
    onSelect(defaultValue);
    // }
  }, [defaultValue]);

  const fetchSelectors = async () => {
    const response = await getSectores();
    setSectores(response);
  };

  const handleChange = (e: any) => {
    console.log("🚀 ~ e:", e)
    setSelectedSector(e);
    onSelect(e);
  };

  return (
    <select
      value={selectedSector}
      // onChange={handleChange}
      className="border rounded p-2 w-full bg-transparent cursor-pointer"
    >
      <option value="">-- Seleccionar sector --</option>
      {sectores.map((selector, index) => (
        <option
          key={index}
          value={selector.id}
          onClick={() => handleChange(selector.id)}
        >
          {selector.nombre}
        </option>
      ))}
    </select>
  );
}
