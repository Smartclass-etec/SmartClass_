// notifications.js - Sistema profissional de notificações
// Estilo moderno, animado e responsivo

class NotificationSystem {
    constructor() {
        this.container = null;
        this.notificationsQueue = [];
        this.isShowing = false;
        this.init();
    }

    init() {
        // Criar container para as notificações
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
                max-width: 380px;
                width: calc(100% - 40px);
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notification-container');
        }
    }

    // Mostrar notificação
    show(message, type = 'success', duration = 4000, options = {}) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            duration,
            title: options.title || this.getTitleByType(type),
            icon: options.icon || this.getIconByType(type),
            actions: options.actions || null
        };
        
        this.notificationsQueue.push(notification);
        this.processQueue();
    }

    getTitleByType(type) {
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Atenção',
            info: 'Informação'
        };
        return titles[type] || 'Notificação';
    }

    getIconByType(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-bell';
    }

    processQueue() {
        if (this.isShowing || this.notificationsQueue.length === 0) return;
        
        this.isShowing = true;
        const notification = this.notificationsQueue.shift();
        this.renderNotification(notification);
    }

    renderNotification(notification) {
        const notifElement = document.createElement('div');
        notifElement.className = `notification-professional ${notification.type}`;
        notifElement.id = `notif-${notification.id}`;
        
        // Cores por tipo
        const colors = {
            success: { bg: 'linear-gradient(135deg, #00796b, #004d47)', icon: '#4caf50', border: '#00796b' },
            error: { bg: 'linear-gradient(135deg, #d32f2f, #b71c1c)', icon: '#f44336', border: '#d32f2f' },
            warning: { bg: 'linear-gradient(135deg, #f57c00, #e65100)', icon: '#ff9800', border: '#f57c00' },
            info: { bg: 'linear-gradient(135deg, #1976d2, #0d47a1)', icon: '#2196f3', border: '#1976d2' }
        };
        
        const color = colors[notification.type] || colors.success;
        
        notifElement.style.cssText = `
            background: ${color.bg};
            border-radius: 16px;
            padding: 16px 20px;
            color: white;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 0;
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
            display: flex;
            align-items: flex-start;
            gap: 14px;
            backdrop-filter: blur(10px);
            border-left: 4px solid ${color.border};
        `;
        
        notifElement.innerHTML = `
            <div class="notification-icon" style="flex-shrink: 0;">
                <i class="fas ${notification.icon}" style="font-size: 22px; color: ${color.icon};"></i>
            </div>
            <div class="notification-content" style="flex: 1; min-width: 0;">
                <div class="notification-title" style="font-weight: 700; font-size: 14px; margin-bottom: 4px; letter-spacing: 0.3px;">
                    ${notification.title}
                </div>
                <div class="notification-message" style="font-size: 12px; opacity: 0.9; line-height: 1.4; word-wrap: break-word;">
                    ${notification.message}
                </div>
            </div>
            <div class="notification-close" style="flex-shrink: 0; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;" onclick="this.closest('.notification-professional').remove(); window.notificationSystem?.nextNotification();">
                <i class="fas fa-times" style="font-size: 14px;"></i>
            </div>
            <div class="notification-progress" style="position: absolute; bottom: 0; left: 0; height: 3px; background: rgba(255,255,255,0.4); width: 100%; border-radius: 0 0 16px 16px;">
                <div class="progress-bar" style="width: 100%; height: 100%; background: white; border-radius: 0 0 0 16px; transition: width ${notification.duration}ms linear;"></div>
            </div>
        `;
        
        this.container.appendChild(notifElement);
        
        // Animar entrada
        setTimeout(() => {
            notifElement.style.opacity = '1';
            notifElement.style.transform = 'translateX(0)';
        }, 10);
        
        // Iniciar barra de progresso
        const progressBar = notifElement.querySelector('.progress-bar');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 50);
        }
        
        // Auto-fechar após duração
        const timeout = setTimeout(() => {
            this.closeNotification(notifElement);
        }, notification.duration);
        
        // Permitir fechar manualmente
        const closeBtn = notifElement.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                clearTimeout(timeout);
                this.closeNotification(notifElement);
            };
        }
        
        notifElement.dataset.timeout = timeout;
    }

    closeNotification(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        setTimeout(() => {
            if (element && element.parentNode) {
                element.remove();
                this.nextNotification();
            }
        }, 300);
    }

    nextNotification() {
        this.isShowing = false;
        if (this.notificationsQueue.length > 0) {
            setTimeout(() => this.processQueue(), 300);
        }
    }

    // Métodos de atalho
    success(message, duration = 4000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    warning(message, duration = 4500) {
        this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        this.show(message, 'info', duration);
    }

    // Notificação com loading
    loading(message, duration = null) {
        const id = 'loading-' + Date.now();
        const notifElement = document.createElement('div');
        notifElement.id = id;
        notifElement.className = `notification-professional loading`;
        notifElement.style.cssText = `
            background: linear-gradient(135deg, #455a64, #37474f);
            border-radius: 16px;
            padding: 16px 20px;
            color: white;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            margin-bottom: 0;
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 14px;
        `;
        
        notifElement.innerHTML = `
            <div class="notification-icon">
                <div class="loading-spinner" style="width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            </div>
            <div class="notification-content">
                <div class="notification-message" style="font-size: 13px;">${message}</div>
            </div>
        `;
        
        this.container.appendChild(notifElement);
        
        setTimeout(() => {
            notifElement.style.opacity = '1';
            notifElement.style.transform = 'translateX(0)';
        }, 10);
        
        return id;
    }

    hideLoading(id) {
        const element = document.getElementById(id);
        if (element) {
            this.closeNotification(element);
        }
    }

    // Notificação com botões de ação
    confirm(message, onConfirm, onCancel = null, options = {}) {
        const confirmText = options.confirmText || 'Confirmar';
        const cancelText = options.cancelText || 'Cancelar';
        
        const notifElement = document.createElement('div');
        notifElement.className = `notification-professional info`;
        notifElement.style.cssText = `
            background: linear-gradient(135deg, #1976d2, #0d47a1);
            border-radius: 16px;
            padding: 16px 20px;
            color: white;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            margin-bottom: 0;
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
        `;
        
        notifElement.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <i class="fas fa-question-circle" style="font-size: 22px;"></i>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${options.title || 'Confirmação'}</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-bottom: 12px;">${message}</div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="notif-btn notif-cancel" style="background: rgba(255,255,255,0.2); border: none; padding: 6px 16px; border-radius: 20px; color: white; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s;">${cancelText}</button>
                        <button class="notif-btn notif-confirm" style="background: white; border: none; padding: 6px 16px; border-radius: 20px; color: #1976d2; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.2s;">${confirmText}</button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(notifElement);
        
        setTimeout(() => {
            notifElement.style.opacity = '1';
            notifElement.style.transform = 'translateX(0)';
        }, 10);
        
        notifElement.querySelector('.notif-confirm').onclick = () => {
            this.closeNotification(notifElement);
            if (onConfirm) onConfirm();
        };
        
        notifElement.querySelector('.notif-cancel').onclick = () => {
            this.closeNotification(notifElement);
            if (onCancel) onCancel();
        };
        
        return notifElement;
    }
}

// Inicializar sistema de notificações
const notificationSystem = new NotificationSystem();

// Função de atalho global para usar em qualquer lugar
function showNotification(message, type = 'success', duration = 4000) {
    notificationSystem.show(message, type, duration);
}

// Adicionar estilos globais para o spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .notification-professional:hover .notification-progress .progress-bar {
        transition: none !important;
        width: 100% !important;
    }
    
    .notif-btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
    }
    
    .notification-professional {
        animation: none;
    }
    
    /* Responsividade */
    @media (max-width: 480px) {
        #notification-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            width: auto;
        }
        
        .notification-professional {
            padding: 12px 16px !important;
        }
        
        .notification-title {
            font-size: 13px !important;
        }
        
        .notification-message {
            font-size: 11px !important;
        }
    }
`;
document.head.appendChild(style);

// Expor globalmente
window.notificationSystem = notificationSystem;
window.showNotification = showNotification;