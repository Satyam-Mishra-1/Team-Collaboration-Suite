import React, { useEffect , useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() =>{
     if (editorRef.current) return;

     async function init() {
      editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
            mode:{name:'javascript',json:true},
            theme:'dracula',
            autoCloseTags:true,
            autoCloseBrackets : true,
            lineNumbers : true,
         });

          editorRef.current.on('change', (instance, changes) => {
          console.log("Changes",changes)
          const { origin } = changes;
          const code = instance.getValue();
          onCodeChange(code);
          if (origin !== 'setValue') {
            // console.log("Working ",code)
              socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                  roomId,
                  code,
              });
          }
       });


       if (socketRef.current) { 
       socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        console.log("Receiving ",code)
           if(code !== null && editorRef.current){
              editorRef.current.setValue(code);
           }
       });
      }

     }
     init();
  },[onCodeChange, roomId, socketRef]);

  
  useEffect(() => {
    if (socketRef.current) {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            if (code !== null) {
                editorRef.current.setValue(code);
            }
        });
    }

    return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
}, [socketRef.current]);


  return <textarea id="realtimeEditor" ></textarea>
}

export default Editor;





  //  import React, { useEffect } from 'react';
  //  import { EditorView, basicSetup } from '@codemirror/basic-setup';
  //  import { javascript } from '@codemirror/lang-javascript';
  //  import { EditorState } from '@codemirror/state';

  //  const Editor = () => {
  //    useEffect(() => {
  //      const editor = new EditorView({
  //        state: EditorState.create({
  //          doc: '',
  //          extensions: [basicSetup, javascript()],
  //        }),
  //        parent: document.getElementById('realtimeEditor'),
  //      });

  //      return () => editor.destroy(); 
  //    }, []);

  //    return <div id="realtimeEditor" style={{ height: '500px', border: '1px solid black' }}></div>;
  //  };

  //  export default Editor;








// import React, { useEffect, useRef } from 'react';
// import { EditorView, basicSetup } from 'codemirror';
// import { javascript } from '@codemirror/lang-javascript';
// import { closeBrackets } from '@codemirror/autocomplete';
// import { tags } from '@lezer/highlight';
// import { keymap } from '@codemirror/view';
// import { closeTagsKeymap } from '@codemirror/lang-xml';
// import { dracula } from '@uiw/codemirror-theme-dracula';
// // import ACTIONS from '../Actions';

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//     const editorRef = useRef(null);

//     useEffect(() => {
//         if (!editorRef.current) {
//             const editorElement = document.getElementById('realtimeEditor');

//             editorRef.current = new EditorView({
//                 doc: '',
//                 extensions: [
//                     basicSetup,
//                     javascript(),
//                     closeBrackets(),
//                     keymap.of(closeTagsKeymap),
//                     dracula, // Using Dracula theme
//                     EditorView.lineWrapping
//                 ],
//                 parent: editorElement,
//             });

//             editorRef.current.dispatch({
//                 changes: { from: 0, insert: '' }, // Start with an empty editor
//             });

//             const updateListener = EditorView.updateListener.of((update) => {
//                 if (update.docChanged) {
//                     const code = editorRef.current.state.doc.toString();
//                     onCodeChange(code);
//                     // if (socketRef.current) {
//                     //     socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//                     //         roomId,
//                     //         code,
//                     //     });
//                     // }
//                 }
//             });

//             editorRef.current.dispatch({
//                 effects: EditorView.updateListener.of(updateListener),
//             });
//         }
//     }, []);

//     useEffect(() => {
//         // if (socketRef.current) {
//         //     socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         //         if (editorRef.current && code !== null) {
//         //             editorRef.current.dispatch({
//         //                 changes: { from: 0, to: editorRef.current.state.doc.length, insert: code },
//         //             });
//         //         }
//         //     });
//         // }

//         return () => {
//             if (socketRef.current) {
//                 // socketRef.current.off(ACTIONS.CODE_CHANGE);
//             }
//         };
//     }, [socketRef.current]);

//     return <div id="realtimeEditor" style={{ height: '100%', width: '100%' }}></div>;
// };

// export default Editor;


// import React, { useEffect, useRef } from 'react';
// import { EditorView, basicSetup } from 'codemirror';
// import { javascript } from '@codemirror/lang-javascript';
// import { closeBrackets } from '@codemirror/autocomplete';
// import { tags } from '@lezer/highlight';
// import { keymap } from '@codemirror/view';
// import { autoCloseTags } from '@codemirror/lang-xml'; // Use autoCloseTags instead
// import { dracula } from '@uiw/codemirror-theme-dracula';

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//     const editorRef = useRef(null);

//     useEffect(() => {
//         if (!editorRef.current) {
//             const editorElement = document.getElementById('realtimeEditor');

//             editorRef.current = new EditorView({
//                 doc: '',
//                 extensions: [
//                     basicSetup,
//                     javascript(),
//                     closeBrackets(),
//                     keymap.of([autoCloseTags]), // Use autoCloseTags here
//                     dracula,
//                     EditorView.lineWrapping
//                 ],
//                 parent: editorElement,
//             });

//             editorRef.current.dispatch({
//                 changes: { from: 0, insert: '' },
//             });

//             const updateListener = EditorView.updateListener.of((update) => {
//                 if (update.docChanged) {
//                     const code = editorRef.current.state.doc.toString();
//                     onCodeChange(code);
//                 }
//             });

//             editorRef.current.dispatch({
//                 effects: EditorView.updateListener.of(updateListener),
//             });
//         }
//     }, []);

//     useEffect(() => {
//         return () => {
//             if (socketRef.current) {
//                 // Cleanup code if needed
//             }
//         };
//     }, [socketRef.current]);

//     return <div id="realtimeEditor" style={{ height: '100%', width: '100%' }}></div>;
// };

// export default Editor;



// import React, { useEffect, useRef } from 'react';
// import { EditorView, basicSetup } from 'codemirror';
// import { javascript } from '@codemirror/lang-javascript';
// import { closeBrackets } from '@codemirror/autocomplete';
// import { tags } from '@lezer/highlight';
// import { keymap } from '@codemirror/view';
// import { autoCloseTags } from '@codemirror/lang-xml'; // Use autoCloseTags instead
// import { dracula } from '@uiw/codemirror-theme-dracula';
// import ACTIONS from '../Actions';


// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//     const editorRef = useRef(null);

//     useEffect(() => {
//         if (!editorRef.current) {
//             const editorElement = document.getElementById('realtimeEditor');

//             editorRef.current = new EditorView({
//                 doc: '',
//                 extensions: [
//                     basicSetup,
//                     javascript(),
//                     closeBrackets(),
//                     autoCloseTags(), // Using autoCloseTags for closing tags
//                     dracula, // Using Dracula theme
//                     EditorView.lineWrapping
//                 ],
//                 parent: editorElement,
//             });

//             editorRef.current.dispatch({
//                 changes: { from: 0, insert: '' },  // Start with an empty editor
//             });

//             const updateListener = EditorView.updateListener.of((update) => {
//                 if (update.docChanged) {
//                     const code = editorRef.current.state.doc.toString();
//                     onCodeChange(code);
//                     if (socketRef.current) {
//                         socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//                             roomId,
//                             code,
//                         });
//                     }
//                 }
//             });    

//             editorRef.current.dispatch({
//                 effects: EditorView.updateListener.of(updateListener),
//             });
//         }  
//     }, []);

//     useEffect(() => {
//         if (socketRef.current) {      
//             socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//                 if (editorRef.current && code !== null) {
//                     editorRef.current.dispatch({
//                         changes: { from: 0, to: editorRef.current.state.doc.length, insert: code },
//                     });
//                 }
//             });
//         }

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.off(ACTIONS.CODE_CHANGE);
//             }
//         };
//     }, [socketRef.current]);

//     return <div id="realtimeEditor" style={{ height: '100%', width: '100%' }}></div>;
// };

// export default Editor;



// import React, { useEffect, useRef } from 'react';
// import Codemirror from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/dracula.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import ACTIONS from '../Actions';

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//     const editorRef = useRef(null);
//     useEffect(() => {
//         async function init() {
//             editorRef.current = Codemirror.fromTextArea(
//                 document.getElementById('realtimeEditor'),
//                 {
//                     mode: { name: 'javascript', json: true },
//                     theme: 'dracula',
//                     autoCloseTags: true,
//                     autoCloseBrackets: true,
//                     lineNumbers: true,
//                 }
//             );

//             editorRef.current.on('change', (instance, changes) => {
//                 const { origin } = changes;
//                 const code = instance.getValue();
//                 onCodeChange(code);
//                 if (origin !== 'setValue') {
//                     socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//                         roomId,
//                         code,
//                     });
//                 }
//             });
//         }
//         init();
//     }, []);

//     useEffect(() => {
//         if (socketRef.current) {
//             socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//                 if (code !== null) {
//                     editorRef.current.setValue(code);
//                 }
//             });
//         }

//         return () => {
//             socketRef.current.off(ACTIONS.CODE_CHANGE);
//         };
//     }, [socketRef.current]);

//     return <textarea id="realtimeEditor"></textarea>;
// };

// export default Editor;