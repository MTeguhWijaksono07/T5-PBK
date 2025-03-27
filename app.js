const { createApp, ref, computed, watch, onMounted, onUpdated, onBeforeUnmount } = Vue;

createApp({
  setup() {
    // Existing reactive data
    const items = ref([
      { nama: 'Laptop', jumlah: 5 },
      { nama: 'Smartphone', jumlah: 10 },
      { nama: 'Tablet', jumlah: 3 }
    ]);
    
    const newItem = ref({
      nama: '',
      jumlah: ''
    });
    
    const namaInput = ref(null);
    const itemList = ref(null);
    const statusElement = ref(null);
    
    // Existing computed properties
    const totalItems = computed(() => {
      return items.value.reduce((total, item) => total + Number(item.jumlah), 0);
    });
    
    const largeQuantityItems = computed(() => {
      return items.value.filter(item => Number(item.jumlah) > 5);
    });
    
    const totalJenisItem = computed(() => {
      return items.value.length;
    });
    
    // Ref for async operations
    const isLoading = ref(false);
    const errorMessage = ref('');
    
    // Callback-based function to simulate async item validation
    function validateItemCallback(item, callback) {
      setTimeout(() => {
        if (item.nama.length > 0 && item.jumlah > 0) {
          callback(null, item);
        } else {
          callback(new Error('Item validation failed'));
        }
      }, 500);
    }
    
    // Promise-based function to save item
    function saveItemPromise(item) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate network request
          if (item.nama && item.jumlah > 0) {
            resolve({
              success: true,
              message: `Item ${item.nama} berhasil disimpan`,
              item: item
            });
          } else {
            reject(new Error('Gagal menyimpan item'));
          }
        }, 1000);
      });
    }
    
    // Async/Await function to fetch initial items
    async function fetchInitialItems() {
      isLoading.value = true;
      errorMessage.value = '';
      
      try {
        // Simulate fetching items from an API
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { nama: 'Laptop', jumlah: 5 },
              { nama: 'Smartphone', jumlah: 10 },
              { nama: 'Tablet', jumlah: 3 }
            ]);
          }, 1500);
        });
        
        items.value = response;
        isLoading.value = false;
      } catch (error) {
        errorMessage.value = 'Gagal memuat item awal';
        isLoading.value = false;
      }
    }
    
    // Modified tambahItem method using Promises and Async/Await
    async function tambahItem() {
      // Validate input
      if (!newItem.value.nama || !newItem.value.jumlah) {
        alert('Silakan isi semua field');
        return;
      }
      
      // Use callback-based validation
      validateItemCallback(newItem.value, (err, validatedItem) => {
        if (err) {
          console.error('Validasi gagal:', err);
          return;
        }
        
        // Use Promise-based save
        saveItemPromise(validatedItem)
          .then(result => {
            // Add item to list
            items.value.push({
              nama: result.item.nama,
              jumlah: Number(result.item.jumlah)
            });
            
            // Update lastAction
            lastAction.value = `Menambahkan item: ${result.item.nama}`;
            
            // Reset form
            newItem.value.nama = '';
            newItem.value.jumlah = '';
            
            // Focus on name input
            if (namaInput.value) {
              namaInput.value.focus();
            }
          })
          .catch(error => {
            console.error('Gagal menyimpan item:', error);
            alert('Gagal menyimpan item');
          });
      });
    }
    
    
    // Modified lifecycle hooks to use async functions
    onMounted(async () => {
      console.log('Component telah di-mount!');
      
      // Fetch initial items using Async/Await
      await fetchInitialItems();
      
      // Set fokus ke input nama ketika komponen dimount
      if (namaInput.value) {
        namaInput.value.focus();
      }
      
      // Tambahkan event listener untuk keyboard shortcut
      window.addEventListener('keydown', handleKeyShortcuts);
      
      // Pesan welcome
      lastAction.value = 'Aplikasi dimulai';
    });
    
    // Existing refs and return object
    const notifikasi = ref('');
    const statusPerubahan = ref('');
    const lastAction = ref('');
    
    function hapusItem(index) {
      const removedName = items.value[index].nama;
      items.value.splice(index, 1);
      
      // Update lastAction
      lastAction.value = `Menghapus item: ${removedName}`;
    }
    
    function handleKeyShortcuts(event) {
      // Tambahkan item baru dengan Ctrl+Enter
      if (event.ctrlKey && event.key === 'Enter') {
        tambahItem();
      }
    }
    
    // Watch for loading state
    watch(isLoading, (newValue) => {
      console.log('Loading state:', newValue);
    });
    
    return {
      items,
      newItem,
      totalItems,
      largeQuantityItems,
      totalJenisItem,
      notifikasi,
      statusPerubahan,
      lastAction,
      namaInput,
      itemList,
      statusElement,
      isLoading,
      errorMessage,
      tambahItem,
      hapusItem
    };
  }
}).mount('#app');
