import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare, Copy, X, Trash2, SendHorizontal, Bot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    suggestions?: {
        field: string;
        content: string;
    }[];
    timestamp: number;
}

interface ICPAssistantProps {
    onSuggestionClick: (field: string, content: string) => void;
    className?: string;
}

const STORAGE_KEY = 'icp-assistant-messages';
const MAX_MESSAGES = 10;

export function ICPAssistant({ onSuggestionClick, className }: ICPAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Load messages from local storage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                setMessages(parsed);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        }
    }, []);

    // Save messages to local storage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    }, [messages]);

    // Add blinking effect for the assistant button
    useEffect(() => {
        const interval = setInterval(() => {
            setShowTooltip(prev => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        const updatedMessages = [...messages, userMessage].slice(-MAX_MESSAGES);
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/icp-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message,
                suggestions: data.suggestions,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMessage].slice(-MAX_MESSAGES));
        } catch (error) {
            toast.error('Failed to get AI response');
            console.error('AI Assistant error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Conversation history cleared');
    };

    const formatTimestamp = (timestamp: number) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date(timestamp));
    };

    return (
        <div className={cn(
            "w-[400px] border-l bg-background flex flex-col h-full",
            className
        )}>
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bot className="h-5 w-5" />
                        <Sparkles className="h-2.5 w-2.5 text-yellow-500 absolute -top-1 -right-1" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">AI Assistant</h3>
                        <p className="text-xs text-muted-foreground">Powered by Claude</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={clearHistory}
                        title="Clear history"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-4">
                            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            Ask me anything about creating your ICP! I can help with:
                            <ul className="mt-2 space-y-1 list-disc list-inside text-left max-w-md mx-auto">
                                <li>Identifying customer pain points</li>
                                <li>Crafting compelling value propositions</li>
                                <li>Writing effective calls-to-action</li>
                                <li>Analyzing competitors</li>
                                <li>Highlighting product differentiators</li>
                            </ul>
                        </div>
                    )}
                    {messages.map((message, i) => (
                        <div
                            key={i}
                            className={`flex flex-col ${message.role === 'assistant' ? 'items-start' : 'items-end'} w-full`}
                        >
                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <div className="flex items-center gap-2">
                                    {message.role === 'assistant' && (
                                        <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                    <div
                                        className={`rounded-lg px-3 py-1.5 ${message.role === 'assistant'
                                            ? 'bg-muted'
                                            : 'bg-primary text-primary-foreground'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground px-1">
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                            {message.suggestions && (
                                <div className="mt-2 space-y-2 w-full">
                                    {message.suggestions.map((suggestion, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md hover:bg-muted transition-colors group"
                                        >
                                            <span className="font-medium min-w-24 shrink-0">{suggestion.field}:</span>
                                            <p className="flex-1 line-clamp-2">{suggestion.content}</p>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    onSuggestionClick(suggestion.field, suggestion.content)
                                                }
                                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    )}
                </div>
                <div className="border-t p-3 flex gap-2 bg-muted/50">
                    <Textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for help with your ICP..."
                        className="min-h-[60px] resize-none bg-background"
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !input.trim()}
                        className="self-end"
                        size="icon"
                        variant="secondary"
                    >
                        <SendHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
} 