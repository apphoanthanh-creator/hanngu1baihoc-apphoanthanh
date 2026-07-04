import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LESSONS, SUB_LESSONS, VOCABULARY_DATA } from './constants';
import type { Lesson, VocabularyWord } from './types';

// Make TypeScript aware of the HanziWriter library loaded from the CDN
declare const HanziWriter: any;

// --- Authentication Data ---
interface User {
  username: string;
  password: string;
  isValid: (year: number, month: number) => boolean;
  allowedDesc: string;
}

const USERS: User[] = [
  {
    username: 'admin',
    password: '9916',
    isValid: () => true,
    allowedDesc: 'Tất cả các tháng, tất cả các năm'
  },
  {
    username: 'dgan',
    password: '101',
    isValid: (y, m) => y % 2 !== 0 && m >= 1 && m <= 6,
    allowedDesc: 'tháng 1, 2, 3, 4, 5, 6 của năm lẻ'
  },
  {
    username: 'eoam',
    password: '102',
    isValid: (y, m) => y % 2 !== 0 && m >= 2 && m <= 7,
    allowedDesc: 'tháng 2, 3, 4, 5, 6, 7 của năm lẻ'
  },
  {
    username: 'aeon',
    password: '103',
    isValid: (y, m) => y % 2 !== 0 && m >= 3 && m <= 8,
    allowedDesc: 'tháng 3, 4, 5, 6, 7, 8 của năm lẻ'
  },
  {
    username: 'bben',
    password: '104',
    isValid: (y, m) => y % 2 !== 0 && m >= 4 && m <= 9,
    allowedDesc: 'tháng 4, 5, 6, 7, 8, 9 của năm lẻ'
  },
  {
    username: 'hxom',
    password: '105',
    isValid: (y, m) => y % 2 !== 0 && m >= 5 && m <= 10,
    allowedDesc: 'tháng 5, 6, 7, 8, 9, 10 của năm lẻ'
  },
  {
    username: 'exon',
    password: '106',
    isValid: (y, m) => y % 2 !== 0 && m >= 6 && m <= 11,
    allowedDesc: 'tháng 6, 7, 8, 9, 10, 11 của năm lẻ'
  },
  {
    username: 'mmen',
    password: '107',
    isValid: (y, m) => y % 2 !== 0 && m >= 7 && m <= 12,
    allowedDesc: 'tháng 7, 8, 9, 10, 11, 12 của năm lẻ'
  },
  {
    username: 'suen',
    password: '108',
    isValid: (y, m) => (y % 2 !== 0 && m >= 8 && m <= 12) || (y % 2 === 0 && m === 1),
    allowedDesc: 'tháng 8, 9, 10, 11, 12 của năm lẻ và tháng 1 của năm chẵn'
  },
  {
    username: 'xnum',
    password: '109',
    isValid: (y, m) => (y % 2 !== 0 && m >= 9 && m <= 12) || (y % 2 === 0 && (m === 1 || m === 2)),
    allowedDesc: 'tháng 9, 10, 11, 12 của năm lẻ và tháng 1, 2 của năm chẵn'
  },
  {
    username: 'cpun',
    password: '110',
    isValid: (y, m) => (y % 2 !== 0 && m >= 10 && m <= 12) || (y % 2 === 0 && m >= 1 && m <= 3),
    allowedDesc: 'tháng 10, 11, 12 của năm lẻ và tháng 1, 2, 3 của năm chẵn'
  },
  {
    username: 'cvuz',
    password: '111',
    isValid: (y, m) => (y % 2 !== 0 && m >= 11 && m <= 12) || (y % 2 === 0 && m >= 1 && m <= 4),
    allowedDesc: 'tháng 11, 12 của năm lẻ và tháng 1, 2, 3, 4 của năm chẵn'
  },
  {
    username: 'bvez',
    password: '112',
    isValid: (y, m) => (y % 2 !== 0 && m === 12) || (y % 2 === 0 && m >= 1 && m <= 5),
    allowedDesc: 'tháng 12 của năm lẻ và tháng 1, 2, 3, 4, 5 của năm chẵn'
  },
  {
    username: 'yeod',
    password: '101',
    isValid: (y, m) => y % 2 === 0 && m >= 1 && m <= 6,
    allowedDesc: 'tháng 1, 2, 3, 4, 5, 6 của năm chẵn'
  },
  {
    username: 'ycon',
    password: '102',
    isValid: (y, m) => y % 2 === 0 && m >= 2 && m <= 7,
    allowedDesc: 'tháng 2, 3, 4, 5, 6, 7 của năm chẵn'
  },
  {
    username: 'hzum',
    password: '103',
    isValid: (y, m) => y % 2 === 0 && m >= 3 && m <= 8,
    allowedDesc: 'tháng 3, 4, 5, 6, 7, 8 của năm chẵn'
  },
  {
    username: 'dkan',
    password: '104',
    isValid: (y, m) => y % 2 === 0 && m >= 4 && m <= 9,
    allowedDesc: 'tháng 4, 5, 6, 7, 8, 9 của năm chẵn'
  },
  {
    username: 'qkon',
    password: '105',
    isValid: (y, m) => y % 2 === 0 && m >= 5 && m <= 10,
    allowedDesc: 'tháng 5, 6, 7, 8, 9, 10 của năm chẵn'
  },
  {
    username: 'zdem',
    password: '106',
    isValid: (y, m) => y % 2 === 0 && m >= 6 && m <= 11,
    allowedDesc: 'tháng 6, 7, 8, 9, 10, 11 của năm chẵn'
  },
  {
    username: 'dsun',
    password: '107',
    isValid: (y, m) => y % 2 === 0 && m >= 7 && m <= 12,
    allowedDesc: 'tháng 7, 8, 9, 10, 11, 12 của năm chẵn'
  },
  {
    username: 'dnym',
    password: '108',
    isValid: (y, m) => (y % 2 === 0 && m >= 8 && m <= 12) || (y % 2 !== 0 && m === 1),
    allowedDesc: 'tháng 8, 9, 10, 11, 12 của năm chẵn và tháng 1 của năm lẻ'
  },
  {
    username: 'ryum',
    password: '109',
    isValid: (y, m) => (y % 2 === 0 && m >= 9 && m <= 12) || (y % 2 !== 0 && (m === 1 || m === 2)),
    allowedDesc: 'tháng 9, 10, 11, 12 của năm chẵn và tháng 1, 2 của năm lẻ'
  },
  {
    username: 'mdan',
    password: '110',
    isValid: (y, m) => (y % 2 === 0 && m >= 10 && m <= 12) || (y % 2 !== 0 && m >= 1 && m <= 3),
    allowedDesc: 'tháng 10, 11, 12 của năm chẵn và tháng 1, 2, 3 của năm lẻ'
  },
  {
    username: 'rzez',
    password: '111',
    isValid: (y, m) => (y % 2 === 0 && m >= 11 && m <= 12) || (y % 2 !== 0 && m >= 1 && m <= 4),
    allowedDesc: 'tháng 11, 12 của năm chẵn và tháng 1, 2, 3, 4 của năm lẻ'
  },
  {
    username: 'zean',
    password: '112',
    isValid: (y, m) => (y % 2 === 0 && m === 12) || (y % 2 !== 0 && m >= 1 && m <= 5),
    allowedDesc: 'tháng 12 của năm chẵn và tháng 1, 2, 3, 4, 5 của năm lẻ'
  }
];

// --- UI Components ---

interface LessonButtonProps {
  lesson: Lesson;
  onClick: (id: number) => void;
  isActive: boolean;
}

const LessonButton: React.FC<LessonButtonProps> = ({ lesson, onClick, isActive }) => {
  const activeClasses = isActive 
    ? 'bg-orange-600 ring-4 ring-offset-4 ring-orange-400 ring-offset-gray-100 scale-110' 
    : 'bg-orange-500 hover:bg-orange-600 transform hover:scale-105';

  return (
    <button
      onClick={() => onClick(lesson.id)}
      className={`
        flex-shrink-0 h-10 sm:h-12 px-4 rounded-full flex items-center justify-center 
        font-bold text-xs sm:text-base text-white shadow-lg transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-75 whitespace-nowrap
        ${activeClasses}
      `}
      aria-pressed={isActive}
    >
      {lesson.name.replace('B', 'Bài ')}
    </button>
  );
};

interface SubLessonButtonProps {
  label: string;
  onClick: (label: string) => void;
  isActive: boolean;
}

const SubLessonButton: React.FC<SubLessonButtonProps> = ({ label, onClick, isActive }) => {
    const baseColor = 'green';
    
    const activeClasses = isActive
    ? `bg-${baseColor}-600 ring-2 ring-offset-2 ring-${baseColor}-400 ring-offset-gray-100`
    : `bg-${baseColor}-500 hover:bg-${baseColor}-600`;

  return (
    <button
      onClick={() => onClick(label)}
      className={`
        flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-white shadow-md transition-all 
        text-sm sm:text-base
        duration-300 ease-in-out transform hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-${baseColor}-400 focus:ring-opacity-75
        ${activeClasses}
      `}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};

interface HanziWriterModalProps {
  char: string | null;
  onClose: () => void;
}

const HanziWriterModal: React.FC<HanziWriterModalProps> = ({ char, onClose }) => {
  const writerRef = useRef<any>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (char && targetRef.current) {
      targetRef.current.innerHTML = ''; 
      writerRef.current = HanziWriter.create(targetRef.current, char, {
        width: 250,
        height: 250,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1.2,
        delayBetweenStrokes: 150,
        strokeColor: '#f97316',
        radicalColor: '#38bdf8',
      });
      writerRef.current.animateCharacter();
    }
  }, [char]);

  if (!char) return null;

  const handleAnimate = () => writerRef.current?.animateCharacter();
  const handleQuiz = () => writerRef.current?.quiz();

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6 border-2 border-orange-400 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={targetRef} className="bg-white rounded-lg"></div>
        <div className="flex gap-4">
           <button onClick={handleAnimate} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">Tập viết lại</button>
           <button onClick={handleQuiz} className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors">Luyện tập</button>
        </div>
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Đóng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};


interface VocabularyListProps {
  words: VocabularyWord[];
  onCharClick: (char: string) => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ words, onCharClick }) => {
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [revealedWordId, setRevealedWordId] = useState<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  const handlePlaySound = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      alert('Trình duyệt của bạn không hỗ trợ phát âm thanh.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const isHanzi = (char: string) => /[\u4e00-\u9fff]/.test(char);
  
  const handleRevealWord = useCallback((word: VocabularyWord) => {
    if (!isPracticeMode) return;
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    setRevealedWordId(word.id);
    handlePlaySound(word.char);
    revealTimerRef.current = window.setTimeout(() => setRevealedWordId(null), 5000);
  }, [isPracticeMode, handlePlaySound]);

  useEffect(() => {
    setIsPracticeMode(false);
    setRevealedWordId(null);
    return () => { if (revealTimerRef.current) clearTimeout(revealTimerRef.current); };
  }, [words]);


  return (
     <div className="w-full text-left flex flex-col flex-grow relative pt-0 overflow-hidden">
      <div className="absolute top-0 right-0 z-20">
        <button
          onClick={() => setIsPracticeMode(prev => !prev)}
          className="px-4 py-1 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-bl-xl shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
        >
          {isPracticeMode ? 'Hiện' : 'Ẩn'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-4 px-4 py-2 font-bold text-orange-500 border-b-2 border-orange-300 flex-shrink-0 mt-8">
        <span className={`${isPracticeMode ? 'opacity-0' : 'opacity-100'} transition-opacity`}>Chữ Hán</span>
        <span className={`${isPracticeMode ? 'opacity-0' : 'opacity-100'} transition-opacity`}>Pinyin</span>
        <span>Nghĩa</span>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {words.map((word) => {
          const isRevealed = revealedWordId === word.id;
          const isHidden = isPracticeMode && !isRevealed;

          return (
            <div
              key={word.id}
              onClick={() => !isPracticeMode && handlePlaySound(word.char)}
              className="grid grid-cols-3 gap-x-4 items-center px-4 py-3 border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200 rounded-md cursor-pointer"
            >
              <div className={`flex flex-wrap transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>
                {word.char.split('').map((char, index) => {
                  const canAnimate = isHanzi(char);
                  return (
                    <span
                      key={index}
                      onClick={(e) => {
                        if (canAnimate) {
                          e.stopPropagation();
                          onCharClick(char);
                        }
                      }}
                      className={`font-semibold text-lg text-gray-800 ${canAnimate ? 'cursor-pointer hover:text-orange-500 transition-colors' : 'cursor-default'}`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
              <span className={`text-gray-500 transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}>{word.pinyin}</span>
              <span 
                className={`text-gray-700 ${isPracticeMode ? 'cursor-pointer' : ''}`}
                onClick={() => handleRevealWord(word)}
              >
                {word.vi}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TypingExerciseProps {
  words: VocabularyWord[];
  type: 'Gõ TM' | 'Gõ BK' | 'Gõ từ mới' | 'Gõ bài khóa';
}

const TypingExercise: React.FC<TypingExerciseProps> = ({ words, type }) => {
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  const shuffleAndReset = useCallback(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setUserInputs({});
    setScore(0);
  }, [words]);

  useEffect(() => shuffleAndReset(), [shuffleAndReset]);

  useEffect(() => {
    let currentScore = 0;
    shuffledWords.forEach(word => {
      const input = userInputs[word.id];
      if (input !== undefined && input !== '') {
        currentScore += (input === word.char ? 1 : -1);
      }
    });
    setScore(currentScore);
  }, [userInputs, shuffledWords]);

  const handleInputChange = (wordId: number, value: string) => {
    setUserInputs(prev => ({ ...prev, [wordId]: value.trim() }));
  };

  const getInputClassName = (word: VocabularyWord, inputValue: string | undefined) => {
    if (!inputValue) return 'border-gray-300 focus:border-orange-500 focus:ring-orange-500';
    if (inputValue === word.char) return 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500';
    return 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500';
  };

  const isHanziPrompt = type === 'Gõ BK' || type === 'Gõ bài khóa';

  return (
    <div className="w-full text-left flex flex-col flex-grow overflow-hidden">
      <div className="text-center mb-4 flex-shrink-0">
        <p className="text-lg font-bold text-gray-700"> Điểm: <span className="text-sky-600">{score}</span> </p>
      </div>
      <div className="flex-grow overflow-y-auto space-y-6 custom-scrollbar pr-3 -mr-3">
        {shuffledWords.map((word) => (
          <div key={word.id} className="grid grid-cols-1 gap-2">
            <label className={`${isHanziPrompt ? 'text-center text-base font-semibold text-sky-700' : 'text-left text-lg text-gray-600'}`}>
              {isHanziPrompt ? word.char : word.vi}
            </label>
            <input
              type="text"
              value={userInputs[word.id] || ''}
              onChange={(e) => handleInputChange(word.id, e.target.value)}
              className={`w-full p-3 bg-white border-2 rounded-lg text-gray-800 text-xl transition-all duration-300 focus:outline-none ${isHanziPrompt ? 'text-center' : ''} ${getInputClassName(word, userInputs[word.id])}`}
              autoComplete="off"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center flex-shrink-0">
        <button onClick={shuffleAndReset} className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow transform hover:scale-105">Làm lại</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(() => {
    try {
      const saved = localStorage.getItem('savedCredentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.username || '';
      }
    } catch (e) {}
    return '';
  });
  const [password, setPassword] = useState(() => {
    try {
      const saved = localStorage.getItem('savedCredentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.password || '';
      }
    } catch (e) {}
    return '';
  });
  const [loginError, setLoginError] = useState('');
  
  const [selectedLessonId, setSelectedLessonId] = useState<number>(LESSONS[0].id);
  const [selectedSubLesson, setSelectedSubLesson] = useState<string>(SUB_LESSONS[0]);
  const [selectedCharForWriter, setSelectedCharForWriter] = useState<string | null>(null);

  const selectedLesson = LESSONS.find(l => l.id === selectedLessonId);
  const lessonName = selectedLesson ? selectedLesson.name : '';
  const vocabularyForLesson = VOCABULARY_DATA[lessonName] || {};
  
  const effectiveSubLesson = 
    (selectedSubLesson === 'Từ mới') 
      ? 'Từ mới' 
      : selectedSubLesson === 'Gõ từ mới' 
        ? 'Gõ TM' 
        : selectedSubLesson === 'Gõ bài khóa' 
          ? 'Gõ BK' 
          : selectedSubLesson;
  const wordsForSubLesson = vocabularyForLesson[effectiveSubLesson] || [];

  // Enforce fullscreen logic
  useEffect(() => {
    const enforceFullscreen = () => {
      const doc = document as any;
      const elem = document.documentElement as any;
      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen((window as any).ALLOW_KEYBOARD_INPUT);
      }
    };
    const handleInteraction = () => enforceFullscreen();
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const foundUser = USERS.find(u => u.username === user.username);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        if (foundUser && foundUser.isValid(year, month)) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      if (user.isValid(year, month)) {
        setIsAuthenticated(true);
        setLoginError('');
        localStorage.setItem('currentUser', JSON.stringify({ username: user.username }));
        localStorage.setItem('savedCredentials', JSON.stringify({ username, password }));
      } else {
        setLoginError('Tài khoản hết bạn');
      }
    } else {
      setLoginError('Tài khoản hết bạn');
    }
  };

  const handleLessonSelect = (id: number) => {
    setSelectedLessonId(id);
  };

  const handleSubLessonSelect = (label: string) => {
    setSelectedSubLesson(label);
  };

  const renderContent = () => {
    if (!selectedLesson) {
      return <p className="text-gray-500 p-4">Vui lòng chọn một bài học để bắt đầu.</p>;
    }

    if (selectedSubLesson === 'Từ mới') {
      const lessonUrl = `https://tiengtrungbachai.online/hanngu/han1tuvung${selectedLessonId}.html`;
      return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
          <iframe 
            src={lessonUrl} 
            className="w-full flex-grow border-none shadow-inner"
            title={`Lesson ${selectedLessonId} Vocabulary Content`}
          />
        </div>
      );
    }

    if (selectedSubLesson === 'Bài khóa') {
      const giaoTiepUrl = `https://tiengtrungbachai.online/hanngu/han1baikhoa${selectedLessonId}.html`;
      return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
          <iframe 
            src={giaoTiepUrl} 
            className="w-full flex-grow border-none shadow-inner"
            title={`Lesson ${selectedLessonId} Conversation Content`}
          />
        </div>
      );
    }

    if (selectedSubLesson === 'Gõ từ mới' || selectedSubLesson === 'Gõ TM') {
      const goTmUrl = `https://tiengtrungbachai.online/hanngu/han1gotuvung${selectedLessonId}.html`;
      return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
          <iframe 
            src={goTmUrl} 
            className="w-full flex-grow border-none shadow-inner"
            title={`Lesson ${selectedLessonId} TM Typing Content`}
          />
        </div>
      );
    }

    if (selectedSubLesson === 'Gõ bài khóa' || selectedSubLesson === 'Gõ BK') {
      const goBkUrl = `https://tiengtrungbachai.online/hanngu/han1gobaikhoa${selectedLessonId}.html`;
      return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
          <iframe 
            src={goBkUrl} 
            className="w-full flex-grow border-none shadow-inner"
            title={`Lesson ${selectedLessonId} BK Typing Content`}
          />
        </div>
      );
    }

    if (!wordsForSubLesson || wordsForSubLesson.length === 0) {
       return <p className="text-gray-500 p-4">Không có dữ liệu cho phần học này.</p>;
    }

    switch (selectedSubLesson) {
      case 'Gõ từ mới':
      case 'Gõ TM':
      case 'Gõ bài khóa':
      case 'Gõ BK':
        return <TypingExercise words={wordsForSubLesson} type={selectedSubLesson as any} />;
      default:
        return <p className="text-gray-500 p-4">Vui lòng chọn một phần học.</p>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-2 border-orange-400">
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-6"> Tiếng Trung Bắc Hải </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                placeholder="Nhập tên tài khoản"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                placeholder="Nhập mật khẩu"
              />
            </div>
            {loginError && <div className="text-red-500 text-sm text-center font-medium"> {loginError} </div>}
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"> Đăng Nhập </button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-400"> Liên hệ: 0972717006 - 0372636978 </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-800 h-[100dvh] font-sans overflow-hidden flex flex-col">
      <div className="w-full h-full flex flex-col p-0">
        <header className="text-center py-1 flex-shrink-0 bg-white shadow-sm z-10 flex justify-between items-center px-4">
          <div className="w-8"></div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500"> Tiếng Trung Bắc Hải </h1>
          <button onClick={() => { localStorage.removeItem('currentUser'); setIsAuthenticated(false); }} className="text-xs text-gray-500 hover:text-red-500 underline"> Thoát </button>
        </header>

        <main className="bg-white p-1 border-2 border-orange-400 flex-grow flex flex-col overflow-hidden w-full">
          <section className="mb-1 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {LESSONS.map(lesson => (
                <LessonButton key={lesson.id} lesson={lesson} onClick={handleLessonSelect} isActive={selectedLessonId === lesson.id} />
              ))}
            </div>
          </section>

          <section className="mb-2 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {SUB_LESSONS.map(label => (
                <SubLessonButton key={label} label={label} onClick={handleSubLessonSelect} isActive={selectedSubLesson === label} />
              ))}
            </div>
          </section>

          <div className="flex-grow overflow-hidden flex flex-col bg-white rounded-xl shadow-inner border border-gray-100 relative">
            {renderContent()}
          </div>
        </main>
      </div>
      <HanziWriterModal char={selectedCharForWriter} onClose={() => setSelectedCharForWriter(null)} />
    </div>
  );
};

export default App;