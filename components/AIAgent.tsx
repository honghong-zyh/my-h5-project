
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { askAgent, generateVoiceResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

// Implementation of decode and decodeAudioData for raw PCM audio from Gemini API.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '您好！我是 FastMoss AI 助手。我可以帮您分析 TikTok 店铺、发现爆款商品或寻找优质达人。您想了解什么？',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Map roles correctly for the API: assistant -> model.
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }]
      }));
      
      const result = await askAgent(input, history);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        groundingSources: result.sources
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我现在处理数据有些困难，请稍后再试。',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const playTTS = async (text: string) => {
    const base64 = await generateVoiceResponse(text);
    if (base64) {
      // Decode and play raw PCM data returned by the Gemini API.
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const audioBuffer = await decodeAudioData(
        decode(base64),
        outputAudioContext,
        24000,
        1,
      );
      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputAudioContext.destination);
      source.start();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-950">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-xl ${
              m.role === 'user' 
                ? 'bg-[#FE2062] text-white rounded-tr-none shadow-lg shadow-[#FE2062]/10' 
                : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
              
              {m.role === 'assistant' && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-2">
                  <button 
                    onClick={() => playTTS(m.content)}
                    className="text-[#FE2062] hover:bg-[#FE2062]/10 p-1 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {ICONS.Zap} <span className="text-[10px] font-bold">语音朗读</span>
                    </div>
                  </button>
                  <span className="text-[10px] text-gray-600">
                    Powered by Gemini 3 Pro
                  </span>
                </div>
              )}

              {m.groundingSources && m.groundingSources.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">数据来源:</p>
                  {m.groundingSources.slice(0, 2).map((s: any, i) => (
                    <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="block text-[10px] text-[#FE2062] underline truncate">
                      {s.web?.title || s.web?.uri}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FE2062] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-1.5 h-1.5 bg-[#FE2062] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1.5 h-1.5 bg-[#FE2062] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-800 backdrop-blur-md sticky bottom-0">
        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问我关于选品或达人的问题..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-200 py-2 px-1 outline-none placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-2.5 rounded-lg transition-all ${
              input.trim() ? 'bg-[#FE2062] text-white shadow-md shadow-[#FE2062]/20' : 'bg-gray-700 text-gray-500'
            }`}
          >
            {ICONS.Search}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
