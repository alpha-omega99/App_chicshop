#!/bin/bash
# Script de démarrage MySQL pour ChicShop+
# À exécuter si le pod redémarre

set -e

echo "🌸 ChicShop+ - Démarrage de la base de données..."

# Installer MariaDB si pas installé
if ! command -v mysql &> /dev/null; then
    echo "📦 Installation de MariaDB..."
    apt-get update && apt-get install -y mariadb-server libmariadb-dev libmariadb3 default-libmysqlclient-dev
fi

# Démarrer le service
service mariadb start 2>&1 || true
sleep 2

# Créer la base de données et configurer l'utilisateur
mysql -e "CREATE DATABASE IF NOT EXISTS ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1 || true
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Homme224\$0586838902'; FLUSH PRIVILEGES;" 2>&1 || true

echo "✓ MySQL démarré"

# Appliquer les migrations
cd /app/backend
python manage.py migrate
echo "✓ Migrations appliquées"

# Seed data
python seed_data.py
echo "✓ Données initiales chargées"

# Restart Django
supervisorctl restart django

echo "✨ ChicShop+ est prêt!"
