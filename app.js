const { createApp, ref, computed, watch, onMounted, onUpdated, onBeforeUnmount } = Vue;

createApp({
  setup() {
    // Data items menggunakan ref untuk reaktivitas
    const items = ref([
      { nama: 'Laptop', jumlah: 5 },
      { nama: 'Smartphone', jumlah: 10 },
      { nama: 'Tablet', jumlah: 3 }
    ]);
    
    // Object untuk item baru
    const newItem = ref({
      nama: '',
      jumlah: ''
    });
    
    // Template Refs
    const namaInput = ref(null);
    const itemList = ref(null);
    const statusElement = ref(null);
    
    // Computed properties
    // Dalam lingkungan modul, Anda akan mengimport seperti ini: import { computed } from 'vue'
    // Tetapi di sini kita sudah mengimport dari Vue global object dengan destructuring di baris 1
    
    // Computed property untuk menghitung total items
    const totalItems = computed(() => {
      return items.value.reduce((total, item) => total + Number(item.jumlah), 0);
    });
    
    // Computed property untuk item dengan jumlah > 5
    const largeQuantityItems = computed(() => {
      return items.value.filter(item => Number(item.jumlah) > 5);
    });
    
    // Computed property untuk menghitung jumlah jenis item
    const totalJenisItem = computed(() => {
      return items.value.length;
    });
    
    // Watchers
    // Dalam lingkungan modul, Anda akan mengimport seperti ini: import { watch } from 'vue'
    // Tetapi di sini kita sudah mengimport dari Vue global object dengan destructuring di baris 1
    
    // Watcher untuk memantau perubahan pada array items
    watch(items, (newItems, oldItems) => {
      console.log('Daftar item berubah:');
      console.log('Item baru:', newItems);
      console.log('Item lama:', oldItems);
      
      // Jika jumlah item berubah, tampilkan notifikasi
      if (newItems.length !== oldItems.length) {
        notifikasi.value = `Jumlah jenis item berubah menjadi: ${newItems.length}`;
        
        // Atur timeout untuk menghilangkan notifikasi setelah 3 detik
        setTimeout(() => {
          notifikasi.value = '';
        }, 3000);
      }
    }, { deep: true }); // deep: true untuk memantau perubahan yang lebih dalam pada array
    
    // Watcher untuk memantau total jumlah item
    watch(totalItems, (newTotal, oldTotal) => {
      console.log(`Total jumlah item berubah dari ${oldTotal} menjadi ${newTotal}`);
      
      if (newTotal > oldTotal) {
        statusPerubahan.value = 'meningkat';
      } else if (newTotal < oldTotal) {
        statusPerubahan.value = 'menurun';
      }
      
      // Reset status setelah 3 detik
      setTimeout(() => {
        statusPerubahan.value = '';
      }, 3000);
    });
    
    // Ref untuk notifikasi dan status perubahan
    const notifikasi = ref('');
    const statusPerubahan = ref('');
    const lastAction = ref('');
    
    // Method untuk menambahkan item baru
    function tambahItem() {
      // Validasi input
      if (!newItem.value.nama || !newItem.value.jumlah) {
        alert('Silakan isi semua field');
        return;
      }
      
      // Tambahkan item baru ke dalam array
      items.value.push({
        nama: newItem.value.nama,
        jumlah: Number(newItem.value.jumlah)
      });
      
      // Update lastAction
      lastAction.value = `Menambahkan item: ${newItem.value.nama}`;
      
      // Reset form
      newItem.value.nama = '';
      newItem.value.jumlah = '';
      
      // Focus pada input nama setelah menambahkan item
      if (namaInput.value) {
        namaInput.value.focus();
      }
    }
    
    // Method untuk menghapus item
    function hapusItem(index) {
      const removedName = items.value[index].nama;
      items.value.splice(index, 1);
      
      // Update lastAction
      lastAction.value = `Menghapus item: ${removedName}`;
    }
    
    // Lifecycle Hooks
    // Dalam lingkungan modul, Anda akan mengimport seperti ini: 
    // import { onMounted, onUpdated, onBeforeUnmount } from 'vue'
    
    onMounted(() => {
      console.log('Component telah di-mount!');
      
      // Set fokus ke input nama ketika komponen dimount
      if (namaInput.value) {
        namaInput.value.focus();
      }
      
      // Tambahkan event listener untuk keyboard shortcut
      window.addEventListener('keydown', handleKeyShortcuts);
      
      // Pesan welcome
      lastAction.value = 'Aplikasi dimulai';
    });
    
    onUpdated(() => {
      console.log('Component telah diupdate!');
    });
    
    onBeforeUnmount(() => {
      console.log('Component akan di-unmount!');
      
      // Bersihkan event listener saat unmount
      window.removeEventListener('keydown', handleKeyShortcuts);
    });
    
    // Keyboard shortcuts handler
    function handleKeyShortcuts(event) {
      // Tambahkan item baru dengan Ctrl+Enter
      if (event.ctrlKey && event.key === 'Enter') {
        tambahItem();
      }
    }
    
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
      tambahItem,
      hapusItem
    };
  }
}).mount('#app');