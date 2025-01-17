import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { Icon } from '../../components/icon'
import { Icons } from '../../components/icons'
import { Spacer } from '../../components/spacer'
import { Toast } from '../../components/toast'
import { Toolbar } from '../../components/toolbar'
import { ToolbarButton } from '../../components/toolbar-button'
import { TypingDetector } from '../../components/typing-detector'
import { UserSettingsTheme } from '../../reducers/user-settings'
import { preventSelection } from './prevent-selection'

const preventEvent = (e: React.SyntheticEvent) => e.preventDefault()

const getPaddedText = (text: string, linesToAdd: number) =>
    [...new Array(linesToAdd).fill(''), text].join('\n')

const getFormattedText = (text = '') => {
    const lines = text.split('\n')
    const lineCount = lines.length
    return lines.length < 5 ? getPaddedText(text, 5 - lineCount) : text
}

interface EditorViewPresenterProps {
    value: string
    theme: UserSettingsTheme
    isInputFocused: boolean
    onInputFocusedChange: (isFocused: boolean) => void
    onChange: (text: string) => void
    onDownloadClick: () => void
    onRemoveClick: () => void
    onToggleThemeClick: () => void
    onToggleFullscreenClick: () => void
    isFullscreen: boolean
    isUIVisible: boolean
}
export const EditorViewPresenter = ({
    value,
    theme,
    isInputFocused,
    onChange,
    onInputFocusedChange,
    onDownloadClick,
    onRemoveClick,
    onToggleThemeClick,
    onToggleFullscreenClick,
    isFullscreen,
    isUIVisible,
}: EditorViewPresenterProps) => {
    const inputEl: React.MutableRefObject<HTMLTextAreaElement | null> = useRef(
        null
    )

    const wordCount = value.trim().split(/\s+/).length

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.currentTarget.value)

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            e.key === 'Backspace' &&
            value.at(-1) === '\n' &&
            value.at(-2) !== '\n'
        ) {
            e.preventDefault()
        }
    }

    const focus = () => inputEl.current?.focus()

    useEffect(() => {
        if (inputEl.current === null) return

        const inputElValueLength = inputEl.current.value.length
        inputEl.current.setSelectionRange(
            inputElValueLength,
            inputElValueLength
        )

        inputEl.current.scrollTop = inputEl.current.scrollHeight
    }, [inputEl])

    return (
        <div className='editor'>
            <div className='editor__content' data-testid='editor-content'>
                {isInputFocused ? null : (
                    <TypingDetector onStartedTyping={focus} />
                )}
                <textarea
                    data-testid='editor-input'
                    onSelect={preventSelection}
                    onCopy={preventEvent}
                    onPaste={preventEvent}
                    onCut={preventEvent}
                    onBlur={() => onInputFocusedChange(false)}
                    onFocus={() => onInputFocusedChange(true)}
                    ref={inputEl}
                    autoFocus
                    className='editor__input'
                    placeholder='Start typing...'
                    value={getFormattedText(value)}
                    onKeyDown={onKeyDown}
                    onChange={onInputChange}
                    dir='auto'
                />
                <div className='editor__overlay'>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            </div>
            <span
                className={classNames({
                    'editor__word-count': true,
                    'editor__word-count--active': isUIVisible,
                })}
            >
                {wordCount}
            </span>

            <nav
                className={classNames({
                    editor__footer: true,
                    'editor__footer--active': isUIVisible,
                })}
            >
                <ul>
                    <li>
                        <a
                            href='https://sonnet.io/posts/ulysses'
                            target='_blank'
                        >
                            About Ensō
                        </a>
                    </li>
                    <li>
                        <a href='https://sonnet.io' target='_blank'>
                            Contact
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://sonnet.gumroad.com/l/ewckz'
                            target='_blank'
                        >
                            <strong>Get Ensō for Mac</strong>
                        </a>
                    </li>
                </ul>
            </nav>

            <Toolbar isVisible={isUIVisible}>
                <ToolbarButton label='Download notes' onClick={onDownloadClick}>
                    <Icon source={Icons.save} />
                </ToolbarButton>
                <ToolbarButton onClick={onRemoveClick}>
                    <Icon source={Icons.remove} />
                </ToolbarButton>
                <Spacer />
                <ToolbarButton onClick={onToggleThemeClick}>
                    <Icon source={theme === 'dark' ? Icons.moon : Icons.sun} />
                </ToolbarButton>
                <ToolbarButton onClick={onToggleFullscreenClick}>
                    <Icon
                        source={isFullscreen ? Icons.zoomOut : Icons.zoomIn}
                    />
                </ToolbarButton>
            </Toolbar>

            <Toast />
        </div>
    )
}
