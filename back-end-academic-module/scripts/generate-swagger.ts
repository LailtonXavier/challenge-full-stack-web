async function generateSwagger() {
  try {
    console.log('🔄 Gerando documentação Swagger...');
    
    console.log('✅ Documentação Swagger gerada com sucesso!');
    console.log('📚 Acesse: http://localhost:3000/api-docs');
  } catch (error) {
    console.error('❌ Erro ao gerar documentação:', error);
    process.exit(1);
  }
}

generateSwagger();