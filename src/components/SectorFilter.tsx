"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SectorFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
    "Otros"
  ];

  const handleSectorChange = (sector: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (sector) {
      params.set("query", sector);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      className="border rounded p-2"
      onChange={(e) => handleSectorChange(e.target.value)}
      defaultValue={searchParams.get("sector") || ""}
    >
      <option value="">Todos los sectores</option>
      {sectores.map((sec) => (
        <option key={sec} value={sec}>
          {sec}
        </option>
      ))}
    </select>
  );
}

