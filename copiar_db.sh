#!/bin/bash

echo "🔍 Verificando dispositivos conectados..."
DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l | tr -d ' ')

if [ "$DEVICES" -eq 0 ]; then
    echo ""
    echo "❌ No hay dispositivos conectados"
    echo ""
    echo "📋 Opciones:"
    echo "   1. Conecta un dispositivo Android por USB"
    echo "   2. Inicia un emulador Android"
    echo "   3. Habilita 'Depuración USB' en tu dispositivo"
    echo ""
    echo "💡 Verifica con: adb devices"
    echo ""
    exit 1
fi

echo "✅ Dispositivo(s) encontrado(s):"
adb devices | grep "device"
echo ""

echo "📦 Copiando base de datos desde el dispositivo..."
adb pull /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db ./

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Base de datos copiada exitosamente!"
    echo "📍 Ubicación: $(pwd)/pedidos_polleria.db"
    echo ""
    echo "💡 Ahora puedes abrirla con:"
    echo "   - DB Browser for SQLite: https://sqlitebrowser.org/"
    echo "   - SQLiteStudio: https://sqlitestudio.pl/"
    echo "   - VS Code con extensión SQLite Viewer"
else
    echo ""
    echo "❌ Error al copiar la base de datos"
    echo ""
    echo "🔍 Posibles causas:"
    echo "   1. La app no se ha ejecutado aún (la base de datos se crea al iniciar)"
    echo "   2. La app está usando Expo Go (ubicación diferente)"
    echo "   3. Permisos insuficientes (necesitas root o usar adb)"
    echo ""
    echo "💡 Soluciones:"
    echo "   - Ejecuta la app al menos una vez"
    echo "   - Si usas Expo Go, considera crear una pantalla de debug en la app"
    echo ""
fi
