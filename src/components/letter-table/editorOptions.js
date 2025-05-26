import { Quill } from '@vueup/vue-quill'

// Register Font module
const Font = Quill.import('formats/font')
Font.whitelist = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Helvetica',
  'Verdana',
  'Courier New'
]
Quill.register(Font, true)

export const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [
        'Arial',
        'Times New Roman',
        'Georgia',
        'Helvetica',
        'Verdana',
        'Courier New'
      ] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  },
  placeholder: 'Enter letter content here...',
  theme: 'snow'
}