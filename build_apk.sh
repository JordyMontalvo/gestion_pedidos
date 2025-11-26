#!/bin/bash

echo "🚀 Generador de APK para Gestión Pedidos Pollería"
echo "=================================================="
echo ""

# Verificar si está autenticado
echo "🔍 Verificando autenticación..."
if ! eas whoami &> /dev/null; then
    echo "❌ No estás autenticado en EAS"
    echo ""
    echo "📋 Por favor ejecuta primero:"
    echo "   eas login"
    echo ""
    read -p "¿Quieres iniciar sesión ahora? (s/n): " respuesta
    if [ "$respuesta" = "s" ] || [ "$respuesta" = "S" ]; then
        eas login
    else
        echo "❌ Debes autenticarte primero"
        exit 1
    fi
fi

echo "✅ Autenticado correctamente"
echo ""

# Preguntar qué tipo de build
echo "¿Qué tipo de build quieres generar?"
echo "1) Preview (más rápido, para pruebas)"
echo "2) Production (optimizado, para distribución)"
echo ""
read -p "Selecciona una opción (1 o 2): " opcion

case $opcion in
    1)
        echo ""
        echo "📦 Generando APK de Preview..."
        eas build --platform android --profile preview
        ;;
    2)
        echo ""
        echo "📦 Generando APK de Producción..."
        eas build --platform android --profile production
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ Build iniciado!"
echo "⏳ Esto puede tomar 10-20 minutos"
echo "📱 Recibirás un link para descargar el APK cuando termine"

