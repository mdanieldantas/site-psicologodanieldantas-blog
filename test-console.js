// Teste para verificar removeConsole
console.log('Este log deve ser removido em produção');
console.info('Este info deve ser removido em produção');
console.error('Este error deve ser mantido');
console.warn('Este warn deve ser mantido');

export default function TestComponent() {
  return <div>Teste</div>;
}
