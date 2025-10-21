export const formatedCPF = (cpf: string) => {
  const rawCpf = cpf ? String(cpf).replace(/\D/g, '') : '';
  
  return rawCpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4'
  );
  
}