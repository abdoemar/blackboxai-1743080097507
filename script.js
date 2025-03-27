document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const terminalOutput = document.getElementById('terminal-output');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const runBtn = document.getElementById('runBtn');
    const helpBtn = document.getElementById('helpBtn');

    let commandHistory = [];
    let historyIndex = -1;

    // Help command output
    const helpText = `
الأوامر المتاحة:
  help    - عرض هذه القائمة
  clear   - مسح الشاشة
  save    - حفظ الكود الحالي
  run     - تشغيل الكود الحالي
  
استخدم السهم لأعلى وأسفل للتنقل بين الأوامر السابقة
    `;

    function addOutput(text, className = '') {
        const line = document.createElement('div');
        line.textContent = text;
        line.className = `output-line ${className}`;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Handle command execution
    function executeCommand(command) {
        switch(command.toLowerCase().trim()) {
            case 'help':
                addOutput(helpText);
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                return;
            case 'save':
                const code = editor.textContent;
                const blob = new Blob([code], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'code.txt';
                a.click();
                addOutput('تم حفظ الكود بنجاح!', 'text-green-500');
                break;
            case 'run':
                try {
                    const code = editor.textContent;
                    
                    // Add command to output
                    addOutput('> ' + code, 'text-gray-400');
                    
                    // Setup custom console
                    const outputs = [];
                    const customConsole = {
                        log: function(...args) {
                            outputs.push(args.join(' '));
                        }
                    };

                    // Execute code with console
                    (new Function('console', code))(customConsole);

                    // Display outputs
                    outputs.forEach(output => {
                        addOutput(output, 'text-blue-500');
                    });

                    addOutput('تم تنفيذ الكود بنجاح', 'text-green-500');
                } catch (error) {
                    addOutput('خطأ: ' + error.message, 'text-red-500');
                }
                break;
            default:
                if (command.trim() !== '') {
                    addOutput(`الأمر غير معروف: ${command}`, 'text-red-500');
                }
        }
    }

    // Handle Enter key
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            executeCommand('run');
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.textContent = editor.textContent.substring(0, start) + '  ' + editor.textContent.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 2;
        }
    });

    // Button handlers
    clearBtn.addEventListener('click', () => {
        executeCommand('clear');
    });

    saveBtn.addEventListener('click', () => {
        executeCommand('save');
    });

    runBtn.addEventListener('click', () => {
        executeCommand('run');
    });

    helpBtn.addEventListener('click', () => {
        executeCommand('help');
    });

    // Focus editor on click anywhere in terminal
    document.querySelector('.bg-gray-900').addEventListener('click', () => {
        editor.focus();
    });

    // Initial focus
    editor.focus();
});
