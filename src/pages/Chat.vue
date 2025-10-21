<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Header Component -->
    <AppHeader 
      :title="`محادثة الطلب #${chat?.order_id}`" 
      :subtitle="`التواصل مع ${getOtherPartyName()}`"
    >
      <template #icon>
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </template>
      
      <template #actions>
        <button 
          @click="router.back()"
          class="btn-secondary flex items-center space-x-2 space-x-reverse"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>رجوع</span>
        </button>
      </template>
    </AppHeader>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-xl text-gray-600">جاري تحميل المحادثة...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-red-800 mb-2">حدث خطأ</h3>
          <p class="text-red-700 mb-4">{{ errorMessage }}</p>
          <button @click="router.back()" class="btn-primary">
            العودة للطلبات
          </button>
        </div>
      </div>

      <!-- Chat Interface -->
      <div v-else-if="chat" class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[70vh]">
        <!-- Chat Header (Specific to chat interface) -->
        <div class="bg-primary-600 p-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span class="font-bold text-sm">{{ getOtherPartyInitials() }}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ getOtherPartyName() }}</h3>
                <p class="text-primary-100 text-sm">{{ getOtherPartyRole() }}</p>
              </div>
            </div>
            <div class="text-sm bg-white/20 px-3 py-1 rounded-full">
              طلب #{{ chat.order_id }}
            </div>
          </div>
        </div>

        <!-- Messages Container -->
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col-reverse custom-scrollbar" 
          @scroll="debouncedHandleScroll"
        >
          <!-- Loading More Messages -->
          <div v-if="loadingMore" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent mx-auto"></div>
          </div>

          <!-- No Messages -->
          <div v-if="!loading && messages.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <p class="text-gray-500">لا توجد رسائل بعد. ابدأ المحادثة الآن!</p>
          </div>

          <!-- Messages (reversed order for flex-col-reverse) -->
          <template v-for="(message, index) in reversedMessages" :key="message.id">
            <!-- Date Separator -->
            <div v-if="shouldShowDateSeparator(message, index)" class="text-center my-4 sticky top-0 z-10">
              <span class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">{{ formatDateSeparator(message.created_at) }}</span>
            </div>

            <!-- Message Bubble -->
            <div 
              :class="[
                'flex max-w-xs lg:max-w-md mt-4', /* Adjusted margin-top for spacing between messages */
                isMyMessage(message) ? 'ml-auto justify-end flex-row-reverse' : 'mr-auto justify-start'
              ]"
            >
              <div 
                :class="[
                  'rounded-2xl px-4 py-3 relative',
                  isMyMessage(message) 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                ]"
              >
                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
                <div :class="[
                  'text-xs mt-2 flex items-center space-x-2 space-x-reverse justify-end',
                  isMyMessage(message) ? 'text-primary-200' : 'text-gray-500'
                ]">
                  <span>{{ formatTime(message.created_at) }}</span>
                  <span v-if="isMyMessage(message)" class="flex items-center ml-1">
                    <svg v-if="message.is_read" class="w-4 h-4 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-4 h-4 text-primary-200/60" fill="currentColor" viewBox="0 0 20 20">
                        <!-- أيقونة "تم الإرسال" -->
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="mr-1">{{ message.is_read ? 'مقروء' : 'تم الإرسال' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Typing Indicator -->
        <div v-if="otherPartyTyping" class="text-sm text-gray-500 px-4 pt-2 flex-shrink-0">
          {{ getOtherPartyName() }} يكتب...
        </div>

        <!-- Message Input -->
        <div class="border-t border-gray-200 p-4 flex-shrink-0">
          <form @submit.prevent="sendMessage" class="flex space-x-3 space-x-reverse">
            <div class="flex-1">
              <input
                v-model="newMessage"
                type="text"
                placeholder="اكتب رسالتك هنا..."
                :disabled="sendingMessage"
                @input="sendTypingEvent"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              :disabled="!newMessage.trim() || sendingMessage"
              class="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
            >
              <svg v-if="sendingMessage" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-10h-4M6 12H2m16.364-6.364l-2.828 2.828M7.464 17.536l-2.828 2.828M17.464 6.536l2.828 2.828M4.636 19.364l2.828-2.828"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <span>{{ sendingMessage ? 'جاري الإرسال...' : 'إرسال' }}</span>
            </button>
          </form>
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
import api from '@/services/api' // Make sure this path is correct
import { useAuthStore } from '@/stores/auth' // Make sure this path is correct
import AppHeader from '@/components/AppHeader.vue' // Make sure this path is correct
import echo from '@/plugins/echo' // استيراد Laravel Echo

// --- Helper Functions ---
// Simple debounce function (can be replaced by lodash.debounce if used elsewhere)
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

// --- Vue Refs and State ---
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const chat = ref(null)
const messages = ref([])
const newMessage = ref('')
const loading = ref(true)
const loadingMore = ref(false)
const sendingMessage = ref(false)
const errorMessage = ref('')
const messagesContainer = ref(null)
const currentPage = ref(1)
const lastPage = ref(1)
const otherPartyTyping = ref(false)
let typingTimeout = null // To clear typing indicator
const showScrollToBottomButton = ref(false) // For the scroll-to-bottom button

// --- Computed Properties ---
const hasMoreMessages = computed(() => currentPage.value < lastPage.value)

// Reverse messages for `flex-col-reverse` to display newest at the bottom
const reversedMessages = computed(() => [...messages.value].reverse())

// --- Chat Specific Logic ---
const getOtherPartyName = () => {
  if (!chat.value) return ''
  // Assuming chat object has client_name and provider_name fields or you fetch users
  // You might need to adjust this based on how you fetch user names.
  // Example: if chat.provider is available and it has a name:
  if (auth.user?.id === chat.value.client_id) {
    return chat.value.provider?.name || 'المزود'; // Access through relation
  } else {
    return chat.value.client?.name || 'العميل'; // Access through relation
  }
}

const getOtherPartyRole = () => {
  if (!chat.value) return ''
  return auth.user?.id === chat.value.client_id ? 'مقدم الخدمة' : 'عميل'
}

const getOtherPartyInitials = () => {
  const name = getOtherPartyName()
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2)
}

const isMyMessage = (message) => message.sender_id === auth.user?.id

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// --- Date Separator Logic ---
const isSameDay = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const shouldShowDateSeparator = (message, index) => {
  if (index === reversedMessages.value.length - 1) return true; // Show for the oldest message (which appears first in reversed list)
  const nextMessage = reversedMessages.value[index + 1]; // Compare with the chronologically newer message
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
    // Example: الأحد 25 أكتوبر 2023
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    });
  }
};

// --- Scrolling Logic ---
const scrollToBottom = async (behavior = 'smooth') => {
  await nextTick(() => {
    if (messagesContainer.value) {
      // For flex-col-reverse, scrollTop = 0 is the bottom
      messagesContainer.value.scrollTop = 0; 
      // If you want smooth behavior, consider using an alternative
      // as `scrollTop = 0` is instant.
      // messagesContainer.value.scrollTo({
      //   top: 0, // This is the bottom in flex-col-reverse
      //   behavior: behavior
      // });
    }
  });
};

const handleScroll = () => {
  if (!messagesContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  
  // Show button if scrolled up from the visual bottom (scrollTop > some threshold)
  showScrollToBottomButton.value = scrollTop > 100;

  // Load more messages when scrolled to the very top (oldest messages)
  // With flex-col-reverse, scrollTop increases as you scroll "up" (towards older messages)
  // When scrolled to the very top, scrollTop will be `scrollHeight - clientHeight`
  const isAtTop = scrollTop >= (scrollHeight - clientHeight - 50); // Small buffer

  if (isAtTop && hasMoreMessages.value && !loadingMore.value) {
     loadMoreMessages();
  }
};
const debouncedHandleScroll = debounce(handleScroll, 100); // Debounce scroll event

// --- Message Loading and Sending ---
const loadMoreMessages = async () => {
  if (loadingMore.value || !hasMoreMessages.value) return;

  loadingMore.value = true;
  // Capture scroll position relative to the bottom before new messages are added
  const oldScrollBottom = messagesContainer.value.scrollHeight - messagesContainer.value.scrollTop;

  try {
    const nextPage = currentPage.value + 1;
    const response = await api.get(`/chats/${chat.value.id}/messages?page=${nextPage}`);
    
    // Prepend new (older) messages to the existing list
    messages.value = [...response.data.data, ...messages.value];
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;

    await nextTick(); // Wait for DOM to update after adding new messages

    // Adjust scroll position to keep the current view stable
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight - oldScrollBottom;
    }

  } catch (error) {
    console.error('Error loading more messages:', error);
  } finally {
    loadingMore.value = false;
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sendingMessage.value) return;

  sendingMessage.value = true;
  const messageContent = newMessage.value.trim();
  newMessage.value = ''; // Clear input immediately for better UX
  
  // Send typing stopped event via WebSocket (whisper)
  if (echo && chat.value) {
    echo.private(`chat.${chat.value.id}`)
                .whisper('typing', {
                    user: auth.user,
                    typing: false
                });
  }

  try {
    const response = await api.post(`/chats/${chat.value.id}/messages`, {
      content: messageContent
    });

    // We rely on the WebSocket event to add the message to avoid duplicates
    // However, if you want immediate display for the sender, you can push it here
    // And handle potential duplicates in the listener.
    // For simplicity and immediate feedback, we will push it here:
    messages.value.push(response.data);
    scrollToBottom(); // Scroll to new message
    // No need to mark as read immediately if current user is sender,
    // the backend takes care of marking *other* messages as read.
    // The `is_read` status for own messages is handled by the backend's logic.
  } catch (error) {
    console.error('Error sending message:', error);
    alert('فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
  } finally {
    sendingMessage.value = false;
  }
}

const markMessagesAsRead = async () => {
  if (!chat.value) return;
  try {
    await api.post(`/chats/${chat.value.id}/read`);
    
    // Update local message state to show as read for messages from other party
    messages.value.forEach(message => {
      if (!isMyMessage(message) && !message.is_read) { 
        message.is_read = true;
      }
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

// --- Initial Chat Setup ---
const openOrCreateChat = async () => {
  try {
    const orderId = route.params.orderId;
    const response = await api.post(`/chats/open/${orderId}`);
    chat.value = response.data;
    
    // Ensure chat object includes client and provider details for getOtherPartyName
    // If your backend does not automatically include them, you might need another API call
    // Or modify your ChatController@openForOrder to eager load them.
    // For now, assuming chat.client and chat.provider relations are loaded.

    await loadMessages();
  } catch (error) {
    console.error('Error opening chat:', error);
    throw error;
  }
}

const loadMessages = async () => {
  try {
    const response = await api.get(`/chats/${chat.value.id}/messages`);
    messages.value = response.data.data; // Assuming API returns messages ordered oldest to newest
    currentPage.value = response.data.current_page;
    lastPage.value = response.data.last_page;
    
    scrollToBottom('auto'); // Initial scroll to bottom instantly
    await markMessagesAsRead();
  } catch (error) {
    console.error('Error loading messages:', error);
    throw error;
  }
}

// --- WebSocket / Real-time Logic ---
const sendTypingEvent = debounce(() => {
  if (echo && chat.value) {
    echo.private(`chat.${chat.value.id}`)
                .whisper('typing', {
                    user: auth.user, // Send current authenticated user info
                    typing: newMessage.value.length > 0 // Send true if typing, false if cleared
                });
  }
}, 300); // Debounce typing event to avoid flooding the server

const listenForChatEvents = () => {
  if (!chat.value || !echo) return;

  // Listen for new chat messages
  echo.private(`chat.${chat.value.id}`)
      .listen('NewMessageSent', (e) => { // Make sure this event name matches
          console.log('New message received:', e.message);
          if (e.message.sender_id !== auth.user?.id) { // Only add if from other party
              messages.value.push(e.message);
              scrollToBottom();
              markMessagesAsRead(); // Mark new incoming messages as read
          } else {
              // If it's the current user's message, update its `is_read` status
              // This is a bit tricky as `is_read` is for the *receiver*.
              // When current user sends, `is_read` is false initially.
              // When the other party reads it, the backend should update it.
              // For now, let's assume the backend will handle read status for sent messages.
              // We can update the local message list if the backend broadcasts a "message_read" event.
              const index = messages.value.findIndex(msg => msg.id === e.message.id);
              if (index !== -1) {
                  messages.value[index].is_read = e.message.is_read;
              }
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

// Watch for chat object changes to subscribe/unsubscribe from Echo channels
watch(chat, (newChat, oldChat) => {
  if (newChat && newChat.id !== oldChat?.id) {
    // Unsubscribe from old channel if it exists
    if (oldChat && echo) {
      echo.private(`chat.${oldChat.id}`).stopListening('NewMessageSent');
      echo.private(`chat.${oldChat.id}`).stopListeningForWhisper('typing');
    }
    listenForChatEvents(); // Subscribe to new chat channel
  }
});


// --- Lifecycle Hooks ---
onMounted(async () => {
  try {
    if (!auth.isAuthenticated) {
      errorMessage.value = 'يجب تسجيل الدخول للدخول إلى المحادثة';
      router.push('/login');
      return;
    }

    await openOrCreateChat();
    
    // Add scroll event listener
    if (messagesContainer.value) {
      messagesContainer.value.addEventListener('scroll', debouncedHandleScroll);
    }

  } catch (error) {
    console.error('Error initializing chat:', error);
    if (error.response?.status === 401) {
      errorMessage.value = 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى';
      auth.logout();
      router.push('/login');
    } else if (error.response?.status === 403) {
      errorMessage.value = 'غير مسموح لك بالوصول إلى هذه المحادثة';
    } else if (error.response?.status === 404) {
      errorMessage.value = 'الطلب غير موجود';
    } else {
      errorMessage.value = 'حدث خطأ أثناء تحميل المحادثة';
    }
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  // Clear typing indicator timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  // Remove scroll event listener
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', debouncedHandleScroll);
  }
  // Unsubscribe from WebSocket channel if chat was active
  if (chat.value && echo) {
    echo.private(`chat.${chat.value.id}`).stopListening('NewMessageSent');
    echo.private(`chat.${chat.value.id}`).stopListeningForWhisper('typing');
  }
});
</script>

<style scoped>
/* Base button styles */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200;
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

/* Flexbox specific spacing for reversed column layout */
/* These styles should largely be handled by template classes like mt-4 */
/* .flex-col-reverse > * + * {
  margin-top: 0; 
} */

/* Specific adjustment for flex-row-reverse for sender's message bubble */
.ml-auto.justify-end.flex-row-reverse > div {
  margin-right: 0.5rem; /* Space between message bubble and edge for sender */
}
.mr-auto.justify-start > div {
  margin-left: 0.5rem; /* Space between message bubble and edge for receiver */
}

/* Transition for the scroll to bottom button */
.v-enter-active, .v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>