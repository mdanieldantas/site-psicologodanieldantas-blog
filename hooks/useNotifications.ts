'use client'

import { useCallback } from 'react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationOptions {
  title?: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Hook personalizado para exibir notificações
 * 
 * @example
 * const { showNotification } = useNotifications()
 * 
 * // Notificação simples
 * showNotification('success', 'Operação realizada com sucesso!')
 * 
 * // Notificação com opções
 * showNotification('error', 'Erro ao carregar dados', {
 *   title: 'Ops!',
 *   duration: 5000,
 *   position: 'top-right'
 * })
 */
export const useNotifications = () => {
  const showNotification = useCallback((
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ) => {
    const {
      title,
      duration = 4000,
      position = 'top-right',
      action
    } = options

    // Se existe uma biblioteca de toast/notification instalada, use ela
    // Por exemplo: react-hot-toast, react-toastify, sonner, etc.
    // Por agora, vamos usar uma implementação simples com console e alert como fallback
    
    console.group(`📢 Notificação [${type.toUpperCase()}]`)
    if (title) console.log('Título:', title)
    console.log('Mensagem:', message)
    console.log('Posição:', position)
    console.log('Duração:', duration)
    if (action) console.log('Ação:', action.label)
    console.groupEnd()

    // Implementação simples usando DOM API
    createNotificationElement(type, message, { title, duration, position, action })
  }, [])

  return { showNotification }
}

/**
 * Cria um elemento de notificação simples
 */
function createNotificationElement(
  type: NotificationType,
  message: string,
  options: NotificationOptions
) {
  // Verifica se já existe um container de notificações
  let container = document.getElementById('notifications-container')
  
  if (!container) {
    container = document.createElement('div')
    container.id = 'notifications-container'
    container.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    `
    document.body.appendChild(container)
  }

  // Cria o elemento da notificação
  const notification = document.createElement('div')
  notification.style.cssText = `
    background: ${getNotificationColor(type)};
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 100%;
    word-wrap: break-word;
  `

  // Adiciona o conteúdo
  const content = document.createElement('div')
  if (options.title) {
    const title = document.createElement('div')
    title.style.fontWeight = 'bold'
    title.style.marginBottom = '0.25rem'
    title.textContent = options.title
    content.appendChild(title)
  }
  
  const messageEl = document.createElement('div')
  messageEl.textContent = message
  content.appendChild(messageEl)

  if (options.action) {
    const actionBtn = document.createElement('button')
    actionBtn.textContent = options.action.label
    actionBtn.style.cssText = `
      margin-top: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.75rem;
    `
    actionBtn.onclick = options.action.onClick
    content.appendChild(actionBtn)
  }

  notification.appendChild(content)

  // Adiciona botão de fechar
  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = '×'
  closeBtn.style.cssText = `
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
    opacity: 0.7;
  `
  closeBtn.onclick = () => removeNotification(notification)
  notification.appendChild(closeBtn)

  // Adiciona ao container
  container.appendChild(notification)

  // Anima a entrada
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)'
  })

  // Remove automaticamente após a duração
  setTimeout(() => {
    removeNotification(notification)
  }, options.duration || 4000)
}

function removeNotification(notification: HTMLElement) {
  notification.style.transform = 'translateX(100%)'
  setTimeout(() => {
    notification.remove()
  }, 300)
}

function getNotificationColor(type: NotificationType): string {
  const colors = {
    success: '#10B981', // green-500
    error: '#EF4444',   // red-500
    warning: '#F59E0B', // amber-500
    info: '#3B82F6'     // blue-500
  }
  return colors[type]
}
