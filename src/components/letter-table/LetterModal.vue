<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
          <!-- Content section -->
          <div class="h-full overflow-y-auto pt-20 px-8 pb-8 bg-gray-50">
            <div class="bg-white rounded-xl shadow-sm p-8">
              <QuillEditor
                v-model:content="letterForm.content"
                :options="editorOptions"
                :toolbar="editorOptions.modules.toolbar"
                theme="snow"
                class="min-h-[400px]"
              />
            </div>
          </div>
          <!-- ... rest of your modal content ... -->
        </div>
      </div>
    </div>
  </transition>
</template>


