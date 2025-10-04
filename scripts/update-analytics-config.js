#!/usr/bin/env node

/**
 * Script de mise à jour des configurations analytics
 * TPS BASE V1 - Shopiweb Premium
 */

const fs = require('fs');
const path = require('path');

class AnalyticsUpdater {
  async run() {
    console.log('🔄 Mise à jour des configurations Analytics');
    console.log('='.repeat(50));

    await this.createScriptsDirectory();
    await this.updateEnvironmentVars();
    await this.updateSentryConfig();
    await this.updateGitHubSettings();

    console.log('\n✅ Configuration terminée !');
  }

  async createScriptsDirectory() {
    console.log('\n📁 Création du dossier scripts...');

    const scriptsDir = path.join(process.cwd(), 'scripts');

    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
      console.log('✅ Dossier scripts créé');
    }

    const checkIntegrationsScript = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Vérification des intégrations Analytics & Monitoring');
console.log('=' .repeat(60));

const themePath = path.join(process.cwd(), 'layout/theme.liquid');
if (fs.existsSync(themePath)) {
  const content = fs.readFileSync(themePath, 'utf8');
  
  console.log('\\nAnalyse des fichiers du thème...');
  
  if (content.includes('gtag') || content.includes('GA_MEASUREMENT_ID')) {
    console.log('✓ Google Analytics 4 détecté - Mettre à jour GA_MEASUREMENT_ID');
  }
  
  if (content.includes('sentry.io')) {
    console.log('✓ Sentry détecté - Créer nouveau projet pour TPS-BASE-V1');
  }
}

console.log('\\nRÉSUMÉ DES ACTIONS REQUISES :');
console.log('1. Créer nouveaux projets pour outils liés au repo');
console.log('2. Reconfigurer analytics pour nouveau domaine');
console.log('3. Configurer selon le store Shopify de destination');
console.log('4. Mettre à jour toutes les variables d\\'environnement');
`;

    const checkIntegrationsPath = path.join(scriptsDir, 'check-integrations.js');
    fs.writeFileSync(checkIntegrationsPath, checkIntegrationsScript);
    console.log('✅ Script check-integrations.js créé');

    try {
      fs.chmodSync(checkIntegrationsPath, 0o755);
    } catch (error) {
      // Ignore sur Windows
    }
  }

  async updateEnvironmentVars() {
    console.log('\n📝 Variables analytics à configurer :');
    console.log('  • GOOGLE_ANALYTICS_ID: ID Google Analytics (GA4)');
    console.log('  • FACEBOOK_PIXEL_ID: ID Facebook Pixel');
    console.log('  • TIKTOK_PIXEL_ID: ID TikTok Pixel');
    console.log('  • AHREFS_ANALYTICS_KEY: Clé Ahrefs Analytics');
    console.log('  • SENTRY_DSN: DSN Sentry (nouveau projet requis)');
    console.log('\n💡 Éditez le fichier .env avec vos nouvelles valeurs');
  }

  async updateSentryConfig() {
    console.log('\n�� Configuration Sentry...');
    console.log('⚠️  IMPORTANT: Créez un NOUVEAU projet Sentry pour ce repo !');
    console.log('1. Aller sur https://sentry.io');
    console.log('2. Créer nouveau projet : "TPS-BASE-V1"');
    console.log('3. Copier le DSN dans .env');
  }

  async updateGitHubSettings() {
    console.log('\n⚙️  Configuration GitHub...');
    console.log('Secrets GitHub à configurer dans ce repo :');
    console.log('• SHOPIFY_CLI_THEME_TOKEN');
    console.log('• SHOPIFY_FLAG_STORE');
    console.log('• SENTRY_AUTH_TOKEN (si monitoring actif)');
    console.log('\nURL: https://github.com/Stardust75001/TPS-BASE-V1/settings/secrets/actions');
  }
}

if (require.main === module) {
  const updater = new AnalyticsUpdater();
  updater.run().catch(console.error);
}

module.exports = AnalyticsUpdater;
