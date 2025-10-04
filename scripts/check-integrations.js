#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Vérification des intégrations Analytics & Monitoring');
console.log('=' .repeat(60));

const themePath = path.join(process.cwd(), 'layout/theme.liquid');
if (fs.existsSync(themePath)) {
  const content = fs.readFileSync(themePath, 'utf8');
  
  console.log('\nAnalyse des fichiers du thème...');
  
  if (content.includes('gtag') || content.includes('GA_MEASUREMENT_ID')) {
    console.log('✓ Google Analytics 4 détecté - Mettre à jour GA_MEASUREMENT_ID');
  }
  
  if (content.includes('sentry.io')) {
    console.log('✓ Sentry détecté - Créer nouveau projet pour TPS-BASE-V1');
  }
}

console.log('\nRÉSUMÉ DES ACTIONS REQUISES :');
console.log('1. Créer nouveaux projets pour outils liés au repo');
console.log('2. Reconfigurer analytics pour nouveau domaine');
console.log('3. Configurer selon le store Shopify de destination');
console.log('4. Mettre à jour toutes les variables d\'environnement');
