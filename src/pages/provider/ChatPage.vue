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
        <div class="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 flex flex-col-reverse custom-scrollbar" ref="chatMessagesContainer" @scroll="debouncedHandleScroll">
          
          <!-- Loading More Messages -->
          <div v-if="loadingMore" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          </div>

          <div v-if="chatMessagesLoading && !loadingMore" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">جاري تحميل الرسائل...</p>
          </div>
          <div v-else-if="chatMessages.length === 0 && !loadingMore" class="text-center text-gray-500 py-8">
            لا توجد رسائل بعد. ابدأ المحادثة!
          </div>
          
          <template v-for="(message, index) in reversedChatMessages" :key="message.id">
             <!-- Date Separator -->
            <div v-if="shouldShowDateSeparator(message, index)" class="text-center my-4 sticky top-0 z-10">
              <span class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">{{ formatDateSeparator(message.created_at) }}</span>
            </div>

            <div 
              :class="{
                'flex justify-end': message.sender_id === auth.user?.id,
                'flex justify-start': message.sender_id !== auth.user?.id
              }"
              class="mb-3"
            >
              <div
                :class="{
                  'bg-blue-600 text-white rounded-br-none': message.sender_id === auth.user?.id,
                  'bg-gray-300 text-gray-800 rounded-bl-none': message.sender_id !== auth.user?.id
                }"
                class="max-w-[75%] p-3 rounded-lg shadow-sm"
              >
                <p class="text-sm">{{ message.content }}</p>
                <span class="block text-xs mt-1" :class="{ 'text-blue-200': message.sender_id === auth.user?.id, 'text-gray-600': message.sender_id !== auth.user?.id }">
                  {{ formatTime(message.created_at) }}
                </span>
                <span v-if="message.sender_id === auth.user?.id" class="flex items-center text-xs mt-1" :class="{ 'text-blue-200': message.sender_id === auth.user?.id }">
                  <svg v-if="message.is_read" class="w-4 h-4 text-blue-200 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-blue-200/60 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  {{ message.is_read ? 'مقروء' : 'تم الإرسال' }}
                </span>
              </div>
            </div>
          </template>
        </div>

        <!-- Typing Indicator -->
        <div v-if="otherPartyTyping" class="text-sm text-gray-500 px-4 pt-2 flex-shrink-0">
          العميل يكتب...
        </div>

        <!-- Message Input -->
        <div class="flex">
          <input
            type="text"
            v-model="newMessageContent"
            @keyup.enter="sendMessage"
            @input="sendTypingEvent"
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

    <!-- Scroll to Bottom Button -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <button 
        v-if="showScrollToBottomButton" 
        @click="scrollToBottom" 
        class="fixed bottom-24 right-8 md:right-12 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 z-20"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // تأكد من المسار الصحيح
import api from '@/services/api' // تأكد من المسار الصحيح
import AppHeader from '@/components/AppHeader.vue' // تأكد من المسار الصحيح
import echo from '@/plugins/echo' // استيراد Laravel Echo

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const orderId = ref(route.params.orderId)
const chatId = ref(null) // سيتم تعيينه بعد فتح/إنشاء المحادثة
const chatMessages = ref([])
const newMessageContent = ref('')
const chatMessagesLoading = ref(false)
const sendingMessage = ref(false)
const chatMessagesContainer = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)
const loadingMore = ref(false)
const otherPartyTyping = ref(false)
let typingTimeout = null;
const showScrollToBottomButton = ref(false)

// --- Helper Functions ---
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

// --- Computed Properties ---
const hasMoreMessages = computed(() => currentPage.value < lastPage.value)
const reversedChatMessages = computed(() => [...chatMessages.value].reverse())


// --- Date Separator Logic ---
const isSameDay = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const shouldShowDateSeparator = (message, index) => {
  if (index === reversedChatMessages.value.length - 1) return true; // Show for the oldest message (which appears first in reversed list)
  const nextMessage = reversedChatMessages.value[index + 1]; // Compare with the chronologically newer message
  return !isSameDay(message.created_at, nextMessage.created_at);
};

const formatDateSeparator = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Set to yesterday's date

  if (isSameDay(date, today)) {
    return 'اليوم';
  } else if (isSameDay(date, yesterday)) {
    return 'أمس';
  } else {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    });
  }
};


// --- Scrolling Logic ---
const scrollToBottom = async (behavior = 'smooth') => {
  await nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
      // If using flex-col-reverse, scrollTop = 0 means bottom.
      // We need to scroll to the actual bottom.
      // This simple assignment should work for flex-col-reverse:
      // chatMessagesContainer.value.scrollTop = 0; // Or currentHeight - containerHeight to reach the visible bottom
      // Let's rely on scrollHeight - clientHeight for bottom for now
    }
  });
};


const handleScroll = () => {
  if (!chatMessagesContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = chatMessagesContainer.value;

  // With flex-col-reverse, scrollTop of 0 is the bottom.
  // We want to detect scroll to top to load more messages.
  // scrollTop will increase as you scroll "up" towards older messages.
  // The 'top' is reached when (scrollHeight - clientHeight - scrollTop) is small or 0
  // Or, more simply, if scrollTop is close to its max value.
  const isAtTop = scrollTop + clientHeight >= scrollHeight - 50; // scrolled to oldest messages

  if (isAtTop && hasMoreMessages.value && !loadingMore.value) {
    loadMoreMessages();
  }

  // Show button if not at the "visual bottom" (scrollTop > some threshold)
  showScrollToBottomButton.value = scrollTop > 100; // If scrolled up from visual bottom
};
const debouncedHandleScroll = debounce(handleScroll, 100);

const loadMoreMessages = async () => {
  if (loadingMore.value || !hasMoreMessages.value) return;

  loadingMore.value = true;
  // Capture scroll position relative to the bottom before new messages are added
  const oldScrollBottom = chatMessagesContainer.value.scrollHeight - chatMessagesContainer.value.scrollTop;

  try {
    const nextPage = currentPage.value + 1;
    const response = await api.get(`/chats/${chatId.value}/messages?page=${nextPage}`);
    
    // Prepend new (older) messages to the existing list
    chatMessages.value = [...response.data.data, ...chatMessages.value];
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;

    await nextTick(); // Wait for DOM to update after adding new messages

    // Adjust scroll position to keep the current view stable
    if (chatMessagesContainer.value) {
        chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight - oldScrollBottom;
    }

  } catch (error) {
    console.error('Error loading more messages:', error);
  } finally {
    loadingMore.value = false;
  }
}

// --- Message Loading and Sending ---
const openChatForOrder = async () => {
  chatMessagesLoading.value = true;
  try {
    const response = await api.post(`/chats/open/${orderId.value}`); // استخدم api مباشرة
    chatId.value = response.data.id;
    await loadChatMessages();
    listenForChatEvents(); // ابدأ الاستماع بعد الحصول على chatId
  } catch (error) {
    console.error('فشل فتح/إنشاء المحادثة:', error);
    alert('فشل فتح/إنشاء المحادثة. يرجى المحاولة مرة أخرى.');
  } finally {
    chatMessagesLoading.value = false;
  }
}

const loadChatMessages = async () => {
  if (!chatId.value) return

  chatMessagesLoading.value = true
  try {
    const response = await api.get(`/chats/${chatId.value}/messages`) // استخدم api مباشرة
    chatMessages.value = response.data.data;
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;

    await nextTick(() => {
      scrollToBottom('auto') // التمرير إلى أسفل بعد تحميل الرسائل
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

const sendMessage = async () => {
  if (!newMessageContent.value.trim() || !chatId.value) return

  sendingMessage.value = true
  const messageContent = newMessageContent.value.trim();
  newMessageContent.value = '' // Clear input immediately
  
  // Send typing stopped event via WebSocket (whisper)
  if (echo && chatId.value) {
    echo.private(`chat.${chatId.value}`)
                .whisper('typing', {
                    user: auth.user,
                    typing: false
                });
  }

  try {
    const response = await api.post(`/chats/${chatId.value}/messages`, {
      content: messageContent
    })
    
    // الرسائل الجديدة يجب أن تُضاف إلى نهاية المصفوفة لتظهر في الأسفل
    // الحدث سيتلقى الرسالة ويبثها، لذا قد لا تحتاج إلى إضافتها هنا يدويًا لتجنب التكرار
    // ولكن لإظهارها على الفور، يمكنك إضافتها هنا:
    chatMessages.value.push(response.data) 
    
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
    await api.post(`/chats/${chatId.value}/read`) // استخدم api مباشرة
    // تحديث حالة الرسائل محليًا لتظهر كمقروءة للمرسل
    chatMessages.value.forEach(message => {
      if (message.sender_id !== auth.user?.id) { // فقط رسائل الطرف الآخر
        message.is_read = true;
      }
    });
    console.log('تم تعليم المحادثة كمقروءة.')
  } catch (error) {
    console.error('فشل تعليم المحادثة كمقروءة:', error)
  }
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}


// --- WebSocket / Real-time Logic ---
const sendTypingEvent = debounce(() => {
  if (echo && chatId.value) {
    echo.private(`chat.${chatId.value}`)
                .whisper('typing', {
                    user: auth.user,
                    typing: newMessageContent.value.length > 0 // Send true if typing, false if cleared
                });
  }
}, 300); // Debounce typing event to avoid flooding the server

const listenForChatEvents = () => {
  if (!chatId.value || !echo) return;

  // Listen for new chat messages
  echo.private(`chat.${chatId.value}`)
      .listen('NewMessageSent', (e) => { // اسم الحدث يجب أن يتطابق مع اسم الحدث في Laravel
          console.log('New message received:', e.message);
          // تأكد من أن الرسالة الجديدة ليست مرسلة من المستخدم نفسه لتجنب التكرار إذا أضفتها يدويًا
          if (e.message.sender_id !== auth.user?.id) {
            chatMessages.value.push(e.message);
            scrollToBottom();
            markChatAsRead(); // Mark new incoming messages as read
          }
      })
      // Listen for typing whispers
      .listenForWhisper('typing', (e) => {
          if (e.user.id !== auth.user?.id) { // Only show typing for the other party
              otherPartyTyping.value = e.typing;
              if (typingTimeout) clearTimeout(typingTimeout);
              if (e.typing) {
                  // Hide typing indicator after 3 seconds of no activity from the other user
                  typingTimeout = setTimeout(() => {
                      otherPartyTyping.value = false;
                  }, 3000); 
              }
          }
      });
};

// Watch for chatId changes to subscribe/unsubscribe from Echo channels
watch(chatId, (newChatId, oldChatId) => {
  if (newChatId && newChatId !== oldChatId) {
    // Unsubscribe from old channel if it exists
    if (oldChatId && echo) {
      echo.private(`chat.${oldChatId}`).stopListening('NewMessageSent');
      echo.private(`chat.${oldChatId}`).stopListeningForWhisper('typing');
    }
    // No need to call listenForChatEvents here, it's called after openChatForOrder
  }
});


// --- Lifecycle Hooks ---
onMounted(async () => {
  if (!auth.isAuthenticated) {
    alert('يجب تسجيل الدخول للدخول إلى المحادثة.');
    router.push('/login');
    return;
  }
  
  // `providerId` يجب أن يتم جلبه من حالة المصادقة وليس ثابتًا
  // هذا الافتراض قد يسبب مشاكل. يجب استخدام auth.user.id
  // providerId.value = auth.user?.id; // تأكد من أن auth.user.id هو معرف المزود

  if (!orderId.value) {
    alert('معرف الطلب غير متوفر.');
    router.back(); // أو توجيه لصفحة الأخطاء
    return;
  }
  
  // إذا كان chatId موجودًا في الـ route (لم يتم تمريره في الـ backend الخاص بك)،
  // فيجب عليك جلبه أولاً أو الاعتماد على openChatForOrder
  // بما أن الـ backend الخاص بك يستخدم `openForOrder`، فإننا سنستخدمه لإنشاء/جلب الـ chat.
  await openChatForOrder(); // هذا سيقوم بضبط chatId وتحميل الرسائل وبدء الاستماع

  // Add scroll event listener
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.addEventListener('scroll', debouncedHandleScroll);
  }
});

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.removeEventListener('scroll', debouncedHandleScroll);
  }
  // Unsubscribe from WebSocket channel if chat was active
  if (chatId.value && echo) {
    echo.private(`chat.${chatId.value}`).stopListening('NewMessageSent');
    echo.private(`chat.${chatId.value}`).stopListeningForWhisper('typing');
  }
});
</script>

<style scoped>
/* Base button styles */
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

/* Custom scrollbar for message container (optional, depends on browser support) */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* gray-300 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* gray-400 */
}
</style>