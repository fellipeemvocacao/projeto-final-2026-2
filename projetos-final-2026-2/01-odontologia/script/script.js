document.addEventListener('DOMContentLoaded', () => {
            // CONFIGURAÇÕES DA CLÍNICA
            const WHATSAPP_NUMBER = "5511999999999"; // Digite o número com DDD (ex: 5511999999999)

            // ELEMENTOS DO DOM
            const toggleBtn = document.getElementById('chatbotToggle');
            const closeBtn = document.getElementById('chatbotClose');
            const chatbotBox = document.getElementById('chatbotBox');
            const chatForm = document.getElementById('chatbotForm');
            const inputField = document.getElementById('chatbotInput');
            const chatBody = document.getElementById('chatbotBody');

            let initialized = false;

            // ESTADO DO FLUXO DE AGENDAMENTO
            let bookingState = {
                active: false,
                step: 0,
                name: '',
                service: ''
            };

            // OPÇÕES RÁPIDAS INICIAIS
            const initialOptions = [
                "Agendar Consulta",
                "Horário de Atendimento",
                "Endereço e Localização",
                "Tratamentos e Valores"
            ];

            // ALTERNAR VISIBILIDADE DO CHATBOT
            function toggleChat() {
                const isHidden = chatbotBox.classList.toggle('hidden');
                if (!isHidden) {
                    inputField.focus();
                    if (!initialized) {
                        startConversation();
                        initialized = true;
                    }
                }
            }

            toggleBtn.addEventListener('click', toggleChat);
            closeBtn.addEventListener('click', () => chatbotBox.classList.add('hidden'));

            // FECHAR AO PRESSIONAR ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !chatbotBox.classList.contains('hidden')) {
                    chatbotBox.classList.add('hidden');
                }
            });

            // INICIAR CONVERSA
            function startConversation() {
                addBotMessage("Olá! Bem-vindo à Clínica Sorriso Santana. 👋\nComo posso ajudar você hoje?");
                addOptions(initialOptions);
            }

            // MENSAGEM DO BOT COM SIMULAÇÃO DE DIGITAÇÃO
            function addBotMessage(text, callback) {
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    const msgDiv = document.createElement('div');
                    msgDiv.classList.add('bot-msg');
                    msgDiv.innerText = text;
                    chatBody.appendChild(msgDiv);
                    scrollToBottom();
                    if (callback) callback();
                }, 600);
            }

            // MENSAGEM DO USUÁRIO
            function addUserMessage(text) {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('user-msg');
                msgDiv.innerText = text;
                chatBody.appendChild(msgDiv);
                scrollToBottom();
            }

            // BOTÕES DE OPÇÕES RÁPIDAS
            function addOptions(options) {
                setTimeout(() => {
                    const optContainer = document.createElement('div');
                    optContainer.classList.add('chat-options');

                    options.forEach(optionText => {
                        const btn = document.createElement('button');
                        btn.classList.add('opt-btn');
                        btn.innerText = optionText;
                        btn.onclick = () => {
                            optContainer.remove(); // Remove as opções após clicar
                            handleUserAction(optionText);
                        };
                        optContainer.appendChild(btn);
                    });

                    chatBody.appendChild(optContainer);
                    scrollToBottom();
                }, 650);
            }

            // INDICADOR DE DIGITAÇÃO ("...")
            function showTypingIndicator() {
                const typingDiv = document.createElement('div');
                typingDiv.classList.add('bot-msg', 'typing');
                typingDiv.id = 'typingIndicator';
                typingDiv.innerHTML = '<span></span><span></span><span></span>';
                chatBody.appendChild(typingDiv);
                scrollToBottom();
            }

            function removeTypingIndicator() {
                const indicator = document.getElementById('typingIndicator');
                if (indicator) indicator.remove();
            }

            function scrollToBottom() {
                chatBody.scrollTop = chatBody.scrollHeight;
            }

            // ENVIAR FORMULÁRIO (INPUT)
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = inputField.value.trim();
                if (!text) return;
                inputField.value = '';
                
                // Remove opções ativas se houver
                const activeOptions = chatBody.querySelector('.chat-options');
                if (activeOptions) activeOptions.remove();

                handleUserAction(text);
            });

            // PROCESSADOR CENTRAL DE RESPOSTAS
            function handleUserAction(text) {
                addUserMessage(text);

                // Se estiver no fluxo de agendamento por etapas
                if (bookingState.active) {
                    processBookingStep(text);
                    return;
                }

                const lowerText = text.toLowerCase();

                if (lowerText.includes('agendar') || lowerText.includes('consulta') || lowerText.includes('marcar')) {
                    startBookingProcess();
                } else if (lowerText.includes('horário') || lowerText.includes('funcionamento') || lowerText.includes('abre')) {
                    addBotMessage("Nosso horário de funcionamento é:\n\n• Segunda a Sexta: 08h às 18h\n• Sábados: 08h às 12h", () => {
                        addOptions(["Agendar Consulta", "Endereço e Localização"]);
                    });
                } else if (lowerText.includes('endereço') || lowerText.includes('onde') || lowerText.includes('localização') || lowerText.includes('fica')) {
                    addBotMessage("Estamos localizados na Rua Voluntários da Pátria, 2000 - Santana, São Paulo - SP (próximo ao metrô Santana).", () => {
                        addOptions(["Agendar Consulta", "Horário de Atendimento"]);
                    });
                } else if (lowerText.includes('valor') || lowerText.includes('preço') || lowerText.includes('tratamento') || lowerText.includes('quanto')) {
                    addBotMessage("Oferecemos Limpeza, Ortodontia (Aparelhos), Clareamento, Implantes e Endodontia.\n\nOs valores dependem de uma avaliação clínica presencial. Gostaria de agendar uma consulta?", () => {
                        addOptions(["Agendar Consulta", "Falar com Atendente"]);
                    });
                } else if (lowerText.includes('atendente') || lowerText.includes('whatsapp') || lowerText.includes('falar')) {
                    addBotMessage("Você pode falar diretamente com nossa equipe no WhatsApp!", () => {
                        openWhatsApp("Olá! Gostaria de tirar algumas dúvidas com o atendimento.");
                    });
                } else {
                    addBotMessage("Não entendi perfeitamente. Como posso te ajudar?", () => {
                        addOptions(initialOptions);
                    });
                }
            }

            // FLUXO DE AGENDAMENTO PASSO A PASSO
            function startBookingProcess() {
                bookingState.active = true;
                bookingState.step = 1;
                addBotMessage("Ótimo! Para adiantar seu agendamento, por favor, me informe o seu **Nome Completo**:");
            }

            function processBookingStep(text) {
                if (bookingState.step === 1) {
                    bookingState.name = text;
                    bookingState.step = 2;
                    addBotMessage(`Prazer, ${text}! Qual serviço você procura?`, () => {
                        addOptions(["Avaliação Geral", "Limpeza / Prevenção", "Aparelho Ortodôntico", "Clareamento", "Outro"]);
                    });
                } else if (bookingState.step === 2) {
                    bookingState.service = text;
                    bookingState.active = false; // Finalizado no bot
                    
                    const message = `Olá! Meu nome é ${bookingState.name}. Gostaria de agendar um atendimento para: ${bookingState.service}.`;
                    
                    addBotMessage("Perfeito! Vou te redirecionar para o nosso WhatsApp para confirmar o melhor dia e horário.", () => {
                        openWhatsApp(message);
                    });
                }
            }

            // REDIRECIONAR PARA O WHATSAPP
            function openWhatsApp(customText) {
                const encodedText = encodeURIComponent(customText);
                const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
                
                addOptions(["Abrir WhatsApp Manualmente"]);
                
                // Abre o WhatsApp em uma nova aba
                window.open(url, '_blank');
            }
        });