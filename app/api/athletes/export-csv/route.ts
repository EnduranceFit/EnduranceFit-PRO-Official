import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    // Busca todos os atletas do Supabase (ignora filtros)
    const { data: athletes, error } = await supabase
      .from('athletes')
      .select('*')
      .order('name');

    if (error) throw error;

    // Se estiver vazio, retorna um cabecalho basico
    if (!athletes || athletes.length === 0) {
      const emptyCsv = "ID,Nome,Email,WhatsApp,Status,Categoria,Objetivo,Peso,Altura,DataCriacao\nNenhum aluno cadastrado ainda,,,,,,,,,";
      return new NextResponse(emptyCsv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="alunos.csv"',
          // Evitar cache no Vercel para que o IMPORTDATA puxe sempre fresco
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // Cabecalhos do CSV
    const headers = ["ID", "Nome", "Email", "WhatsApp", "Status", "Categoria", "Objetivo", "Peso (kg)", "Altura (cm)", "Data Criacao"];
    const csvRows = [headers.join(",")];

    // Transforma os dados em linhas do CSV
    for (const athlete of athletes) {
      const row = [
        `"${athlete.id || ''}"`,
        `"${(athlete.name || '').replace(/"/g, '""')}"`,
        `"${(athlete.email || '').replace(/"/g, '""')}"`,
        `"${(athlete.whatsapp || '').replace(/"/g, '""')}"`,
        `"${athlete.status || ''}"`,
        `"${athlete.category || ''}"`,
        `"${athlete.goal || ''}"`,
        athlete.weight || '',
        athlete.height || '',
        `"${new Date(athlete.created_at || new Date()).toLocaleString('pt-BR')}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvOutput = csvRows.join("\n");

    return new NextResponse(csvOutput, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="alunos.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error: any) {
    console.error("Export CSV Error:", error.message);
    return new NextResponse(`Erro na exportacao,${error.message}\n`, {
      status: 500,
      headers: { 'Content-Type': 'text/csv' }
    });
  }
}
