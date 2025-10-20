<!-- src/views/provider/ChatPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <AppHeader 
      :title="`محادثة الطلب #${orderId}`" 
      subtitle="تواصل مع العميل بخصوص هذا الطلب"
    >
      <template #icon>
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"/>
        </svg>
      </template>
      <template #actions>
        <router-link :to="`/provider/orders/${orderId}`" class="btn-secondary flex items-center space-x-2 space-x-reverse">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>العودة للطلب</span>
        </router-link>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[70vh]">
        <h3 class="text-xl font-bold text-gray-900 mb-4 border-b pb-3">محادثة مع العميل</h3>

        <!-- Chat Messages -->
        <div class="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50" ref="chatMessagesContainer">
          <div v-if="chatMessagesLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">جاري تحميل الرسائل...</p>
          </div>
          <div v-else-if="chatMessages.length === 0" class="text-center text-gray-500 py-8">
            لا توجد رسائل بعد. ابدأ المحادثة!
          </div>
          <div v-for="message in chatMessages" :key="message.id" class="mb-3">
            <div 
              :class="{
                'flex justify-end': message.sender_id === providerId, // افترض أن المزود هو المرسل
                'flex justify-start': message.sender_id !== providerId // العميل هو المرسل
              }"
            >
              <div
                :class="{
                  'bg-blue-600 text-white rounded-br-none': message.sender_id === providerId,
                  'bg-gray-300 text-gray-800 rounded-bl-none': message.sender_id !== providerId
                }"
                class="max-w-[75%] p-3 rounded-lg shadow-sm"
              >
                <p class="text-sm">{{ message.content }}</p>
                <span class="block text-xs mt-1" :class="{ 'text-blue-200': message.sender_id === providerId, 'text-gray-600': message.sender_id !== providerId }">
                  {{ formatTime(message.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="flex">
          <input
            type="text"
            v-model="newMessageContent"
            @keyup.enter="sendMessage"
            placeholder="اكتب رسالتك..."
            class="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500"
            :disabled="!chatId || sendingMessage"
          />
          <button
            @click="sendMessage"
            :disabled="!chatId || !newMessageContent.trim() || sendingMessage"
            class="ml-3 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            <svg v-if="sendingMessage" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { providerService } from '@/services/providerService'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const orderId = ref(route.params.orderId)
const chatId = ref(route.params.chatId || null) 
const providerId = ref(1) // **هام: يجب استبدال هذا بمعرف المزود الفعلي الذي قام بتسجيل الدخول.**

const chatMessages = ref([])
const newMessageContent = ref('')
const chatMessagesLoading = ref(false)
const sendingMessage = ref(false)
const chatMessagesContainer = ref(null) 

onMounted(async () => {
  if (!orderId.value) {
    alert('معرف الطلب غير متوفر.')
    return
  }
  
  if (!chatId.value) {
    await openChatForOrder();
  } else {
    await loadChatMessages();
  }
});

const openChatForOrder = async () => {
  chatMessagesLoading.value = true;
  try {
    const response = await providerService.openChat(orderId.value);
    chatId.value = response.data.id;
    await loadChatMessages(); 
  } catch (error) {
    console.error('فشل فتح/إنشاء المحادثة:', error);
    alert('فشل فتح/إنشاء المحادثة. يرجى المحاولة مرة أخرى.');
  } finally {
    chatMessagesLoading.value = false;
  }
}

// تحميل رسائل المحادثة - تم إزالة .reverse()
const loadChatMessages = async () => {
  if (!chatId.value) return

  chatMessagesLoading.value = true
  try {
    const response = await providerService.getChatMessages(chatId.value)
    // المشكلة هنا كانت في .reverse(). سنفترض أن API يرجع الرسائل الأقدم أولاً.
    // إذا كان API يرجع الأحدث أولاً، لا تحتاج إلى أي معالجة هنا.
    // إذا كان API يرجع الأقدم أولاً (وهو الأفضل للعرض)، قم بتعيينها مباشرة.
    chatMessages.value = response.data.data; // قم بتعيين البيانات مباشرة

    await nextTick(() => {
      scrollToBottom() // التمرير إلى أسفل بعد تحميل الرسائل
    })
    console.log('تم تحميل رسائل المحادثة:', response.data.data)
    await markChatAsRead() 
  } catch (error) {
    console.error('فشل تحميل رسائل المحادثة:', error)
    alert('فشل تحميل رسائل المحادثة.')
  } finally {
    chatMessagesLoading.value = false
  }
}

// إرسال رسالة
const sendMessage = async () => {
  if (!newMessageContent.value.trim() || !chatId.value) return

  sendingMessage.value = true
  try {
    const payload = { content: newMessageContent.value }
    const response = await providerService.sendMessage(chatId.value, payload)
    
    // الرسائل الجديدة يجب أن تُضاف إلى نهاية المصفوفة لتظهر في الأسفل
    chatMessages.value.push(response.data) 
    
    newMessageContent.value = '' 
    await nextTick(() => {
      scrollToBottom() // التمرير إلى أسفل بعد إرسال الرسالة
    })
    console.log('تم إرسال الرسالة بنجاح:', response.data)
  } catch (error) {
    console.error('فشل إرسال الرسالة:', error)
    alert('فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.')
  } finally {
    sendingMessage.value = false
  }
}

const markChatAsRead = async () => {
  if (!chatId.value) return
  try {
    await providerService.markChatAsRead(chatId.value)
    console.log('تم تعليم المحادثة كمقروءة.')
  } catch (error) {
    console.error('فشل تعليم المحادثة كمقروءة:', error)
  }
}

const scrollToBottom = () => {
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
  }
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}
</style>