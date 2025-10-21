<template>
  <div class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
    <!-- Badge de Calidad -->
    <div class="absolute top-4 right-4 z-10">
      <div class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span>Verificado</span>
      </div>
    </div>

    <!-- Imagen del servicio con overlay -->
    <div class="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      <div class="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <img 
          v-if="service.image && service.image !== '/images/default.png'" 
          :src="service.image" 
          :alt="service.name"
          class="w-12 h-12 object-contain"
          @error="handleImageError"
        >
        <svg v-else class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
      <div class="absolute bottom-4 right-4 w-6 h-6 bg-white/20 rounded-full"></div>
    </div>
    
    <!-- Contenido del servicio -->
    <div class="p-6">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {{ service.name }}
        </h3>
        <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {{ service.description }}
        </p>
      </div>
      
      <!-- Rating y Reviews -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-1">
          <div class="flex space-x-1">
            <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <span class="text-sm text-gray-600 ml-2">4.9 (127)</span>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500">Desde</div>
          <div class="text-lg font-bold text-blue-600">$99</div>
        </div>
      </div>
      
      <!-- Botones de contacto mejorados -->
      <div class="space-y-3">
        <!-- Botón WhatsApp Premium -->
        <a 
          :href="whatsappUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        
        <!-- Botón Email Premium -->
        <a 
          :href="emailUrl" 
          class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span>Enviar Email</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const whatsappUrl = computed(() => {
  return `https://wa.me/${props.service.whatsapp}?text=Hola, estoy interesado en el servicio de ${props.service.name}. Me gustaría obtener más información y una cotización.`
})

const emailUrl = computed(() => {
  return `mailto:${props.service.email}?subject=Consulta sobre ${props.service.name}&body=Estimado/a profesional,%0D%0A%0D%0AEstoy interesado/a en obtener más información sobre el servicio de ${props.service.name}.%0D%0A%0D%0APor favor, envíeme una cotización detallada.%0D%0A%0D%0AGracias por su tiempo.%0D%0A%0D%0ASaludos cordiales.`
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>