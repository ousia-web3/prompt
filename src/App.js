import React, { useState } from 'react'; // Corrected import statement

// Custom Button component using Tailwind CSS
const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
  >
    {children}
  </button>
);

// Custom Input component
const Input = ({ label, value, onChange, type = 'text', min, max, infoDescription, onInfoClick, placeholder }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        {label}
        {infoDescription && (
          <span
            className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => onInfoClick(label.split('/')[0].trim(), infoDescription)}
            title="정보 보기"
          >
            📎
          </span>
        )}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      placeholder={placeholder}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

// Custom Select component
const Select = ({ label, options, value, onChange, infoDescription, onInfoClick }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        {label}
        {infoDescription && (
          <span
            className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => onInfoClick(label.split('/')[0].trim(), infoDescription)}
            title="정보 보기"
          >
            📎
          </span>
        )}
      </label>
    )}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Custom Checkbox component
const Checkbox = ({ label, checked, onCheckedChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange(e.target.checked)}
      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
    />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);

// Info Modal Component
const InfoModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 relative">
        {/* Updated title font size */}
        <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>
        {/* Updated content font size */}
        <p className="text-base font-sans text-gray-700 mb-6 whitespace-pre-wrap">{content}</p>
        <div className="flex justify-end">
          <Button onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
};

// Main PromptGenerator component
export default function App() {
  const [form, setForm] = useState({
    subject: '',
    attribute: '',
    style: '',
    composition: '',
    setting: {
      location: '', timeOfDay: '', weather: '', season: '', lighting: '', atmosphere: ''
    },
    emotion: '',
    colorScheme: '',
    negativePrompt: '',
    advanced: false,
    aspectRatio: '1:1',
    quality: 'Normal',
    stylizeWeight: 0,
    seed: '',
    platform: 'General',
    mjVersion: '6',
    mjStyle: 'raw',
    chaos: 0,
    imageWeight: 1.0,
    tile: false,
    stop: 100
  });
  const [langTab, setLangTab] = useState<'ko' | 'en'>('ko');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const fieldDescriptions = {
    subject: "그리려는 장면이나 인물/사물의 중심 키워드를 명확히 입력하세요. 예: ‘우주를 걷는 고양이’",
    attribute: "이미지의 분위기, 색조, 질감 등을 묘사합니다. 예: ‘따뜻한 햇살 아래, 몽환적인 보라색 톤’",
    style: "원하는 표현 기법을 입력하세요. 예: ‘픽셀아트, 고흐풍, 디즈니 3D 애니’",
    composition: "정면, 측면, 클로즈업, 버스트샷, 탑뷰, 로우앵글 등",
    setting: "시간/장소/조명 중심"
  };

  const platformInfo = {
    General: {
      title: "General 모드",
      content: `1. 범용 프롬프트 작성에 최적화
2. 플랫폼 전용 플래그 없이도 모든 엔진(DALL·E, SD, MJ 등)에서 동작
3. 순서 유지: Subject → Attribute → Style → Composition → Setting → Emotion → ColorScheme → Negative → 공통 고급 옵션
4. 간결하게: 불필요한 쉼표·옵션 생략`
    },
    Midjourney: {
      title: "Midjourney 모드",
      content: `1. **버전(--v)**과 **스타일(--style)**은 옵션 중 가장 앞에 배치
2. **Chaos(--chaos)**는 0–100 범위로 랜덤성 조절, 너무 높이면 결과 예측 어려움
3. **Image Weight(--iw)**는 레퍼런스 이미지 반영 강도, 0.1–2.0 권장
4. **Tile(--tile)**은 패턴 생성 전용, 반복 무늬가 필요할 때만 사용
5. **Stop(--stop)**은 10–100 사이로 지정, 낮게 설정할수록 러프한 초안 느낌
6. 공통 고급 옵션(--ar, --q, --seed, ::stylizeWeight)은 Midjourney 플래그 뒤에 추가

* 자세한 내용은 미드저니에 대해서 인터넷으로 찾아보세요.`
    }
  };

  const settingPlaceholders = {
    location: "숲속, 해변, 미래 도시 등",
    timeOfDay: "새벽, 해질녘, 밤하늘",
    weather: "맑음, 안개, 비, 눈",
    season: "봄, 가을, 눈 덮인",
    lighting: "자연광, 역광, 부드러운 그림자",
    atmosphere: "신비로운, 밝고 생동감"
  };

  const handleInfoClick = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowInfoModal(true);
  };

  const handleChange = (key, value) => {
    setForm(prevForm => {
      const newForm = { ...prevForm };
      if (key in newForm.setting) {
        newForm.setting = { ...newForm.setting, [key]: value };
      } else {
        newForm[key] = value;
      }
      return newForm;
    });
  };

  const buildPrompt = (lang) => {
    const parts = [];
    if (form.subject) parts.push(form.subject);
    if (form.attribute) parts.push(form.attribute);
    if (form.style) parts.push(form.style);
    if (form.composition) parts.push(form.composition);
    Object.values(form.setting).filter(x => x).forEach(x => parts.push(x));
    if (form.emotion) parts.push(form.emotion);
    if (form.colorScheme) parts.push(form.colorScheme);
    if (form.negativePrompt) parts.push(`no: ${form.negativePrompt}`);

    // General Advanced options
    if (form.advanced) {
      parts.push(`--ar ${form.aspectRatio}`);
      parts.push(`--q ${form.quality === 'High' ? 2 : form.quality === 'Low' ? 0.5 : 1}`);
      if (form.seed) parts.push(`--seed ${form.seed}`);
      parts.push(`::${form.stylizeWeight}`);
    }

    // Midjourney options
    if (form.platform === 'Midjourney') {
      parts.push(`--v ${form.mjVersion}`);
      parts.push(`--style ${form.mjStyle}`);
      parts.push(`--chaos ${form.chaos}`);
      if (form.tile) parts.push(`--tile`);
      parts.push(`--stop ${form.stop}`);
      parts.push(`--iw ${form.imageWeight}`);
    }

    return parts.join(', ');
  };

  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const downloadFile = (filename, text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const el = document.createElement('a');
    el.href = URL.createObjectURL(blob);
    el.download = filename;
    el.click();
    URL.revokeObjectURL(el.href);
  };

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 min-h-screen font-sans">
      <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">프롬프트 설정 / Prompt Settings</h2>
        <Select
          label="플랫폼 / Platform"
          options={["General","Midjourney"]}
          value={form.platform}
          onChange={v => handleChange('platform', v)}
          infoDescription={platformInfo[form.platform].content}
          onInfoClick={(label, content) => handleInfoClick(platformInfo[form.platform].title, content)}
        />
        <Input
          label="대상 / Subject"
          value={form.subject}
          onChange={e => handleChange('subject', e.target.value)}
          infoDescription={fieldDescriptions.subject}
          onInfoClick={handleInfoClick}
        />
        <Input
          label="속성 / Attribute"
          value={form.attribute}
          onChange={e => handleChange('attribute', e.target.value)}
          infoDescription={fieldDescriptions.attribute}
          onInfoClick={handleInfoClick}
        />
        <Select
          label="스타일 / Style"
          options={[
            "사실주의 (Realism)",
            "수채화 (Watercolor)",
            "유화 (Oil Painting)",
            "픽셀 아트 (Pixel Art)",
            "사이버펑크 (Cyberpunk)",
            "애니메이션 (Anime)",
            "디즈니 3D (Disney 3D)",
            "반 고흐 (Van Gogh)",
            "미니멀리즘 (Minimalism)",
            "미래지향적 (Futuristic)"
          ]}
          value={form.style}
          onChange={v => handleChange('style', v)}
          infoDescription={fieldDescriptions.style}
          onInfoClick={handleInfoClick}
        />
        <Select
          label="구도 / Composition"
          options={[
            "정면 (Front view)",
            "측면 (Side view)",
            "클로즈업 (Close-up)",
            "버스트샷 (Burst shot)",
            "탑뷰 (Top-down)",
            "로우 앵글 (Low angle)"
          ]}
          value={form.composition}
          onChange={v => handleChange('composition', v)}
          infoDescription={fieldDescriptions.composition}
          onInfoClick={handleInfoClick}
        />
        {/* Separated Setting title and inputs, with info icon removed from title */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-800 text-lg mb-3">
            환경/배경 / Setting
          </h3>
          <div className="space-y-3">
            {['location', 'timeOfDay', 'weather', 'season', 'lighting', 'atmosphere'].map(key => (
              <Input
                key={key}
                label={
                  key === 'timeOfDay' ? '시간대 / Time of Day' :
                  key === 'location' ? '배경 장소 / Location' :
                  key === 'weather' ? '날씨 / Weather' :
                  key === 'season' ? '계절 / Season' :
                  key === 'lighting' ? '조명 / Lighting' :
                  '분위기 / Atmosphere'
                }
                value={form.setting[key]}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={settingPlaceholders[key]}
              />
            ))}
          </div>
        </div>
        <Select
          label="감정 표현 / Emotion"
          options={[
            "행복한 (Happy)",
            "슬픈 (Sad)",
            "놀란 (Surprised)",
            "화난 (Angry)",
            "무서운 (Scary)",
            "신나는 (Excited)",
            "피곤한 (Tired)",
            "차분한 (Calm)",
            "당황한 (Embarrassed)",
            "사랑에 빠진 (In love)"
          ]}
          value={form.emotion}
          onChange={v => handleChange('emotion', v)}
        />
        <Select
          label="색 구성 / Color Scheme"
          options={[
            "단색 (Monochrome)",
            "파스텔 (Pastel)",
            "생생한 (Vivid)",
            "흑백 (Black & White)"
          ]}
          value={form.colorScheme}
          onChange={v => handleChange('colorScheme', v)}
        />
        <Input
          label="네거티브 프롬프트 / Negative Prompt"
          value={form.negativePrompt}
          onChange={e => handleChange('negativePrompt', e.target.value)}
          placeholder="텍스트나 워터마크 없이 깔끔하게, 글자나 로고 없이 순수한 이미지로"
        />
        <Checkbox label="고급 옵션 표시 / Show Advanced Options" checked={form.advanced} onCheckedChange={v => handleChange('advanced', v)} />
        {/* Advanced options section, conditionally rendered */}
        {form.advanced && (
          <div className="space-y-3 pl-6 border-l-4 border-blue-300 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">고급 설정 / General Advanced Settings</h3>
            <Select
              label="가로세로 비율 / Aspect Ratio"
              options={["1:1", "16:9", "3:2", "4:5"]}
              value={form.aspectRatio}
              onChange={v => handleChange('aspectRatio', v)}
            />
            <Select
              label="품질 / Quality"
              options={["Low", "Normal", "High"]}
              value={form.quality}
              onChange={v => handleChange('quality', v)}
            />
            <Input
              type="number"
              label="스타일 강도 / Stylize Weight"
              value={form.stylizeWeight}
              onChange={e => handleChange('stylizeWeight', Number(e.target.value))} // Corrected: Added closing parenthesis
              min={0}
              max={1000}
            />
            <Input label="시드 값 / Seed" value={form.seed} onChange={e => handleChange('seed', e.target.value)} />
          </div>
        )}

        {/* Midjourney Specific Options - Now conditionally rendered based on platform selection and OUTSIDE of advanced options */}
        {form.platform === 'Midjourney' && (
          <div className="space-y-3 pl-6 border-l-4 border-purple-300 bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Midjourney 전용 설정</h3>
            <Select
              label="Midjourney 버전 / MJ Version"
              options={["7", "6", "5.2", "5.1", "5"]}
              value={form.mjVersion}
              onChange={v => handleChange('mjVersion', v)}
            />
            <Select
              label="Midjourney 스타일 / MJ Style"
              options={["raw", "stylize", "expressive"]}
              value={form.mjStyle}
              onChange={v => handleChange('mjStyle', v)}
            />
            <Input
              type="number"
              label="혼돈도 / Chaos"
              value={form.chaos}
              onChange={e => handleChange('chaos', Number(e.target.value))}
              min={0}
              max={100}
            />
            <Input
              type="number"
              label="이미지 가중치 / Image Weight"
              value={form.imageWeight}
              onChange={e => handleChange('imageWeight', Number(e.target.value))}
              min={0}
              max={2}
              step={0.1}
            />
            <Checkbox
              label="타일링 / Tile"
              checked={form.tile}
              onCheckedChange={v => handleChange('tile', v)}
            />
            <Input
              type="number"
              label="중단 단계 / Stop"
              value={form.stop}
              onChange={e => handleChange('stop', Number(e.target.value))}
              min={10}
              max={100}
            />
          </div>
        )}
      </div>

      {/* Right column for prompt output and actions */}
      <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">생성된 프롬프트 / Generated Prompt</h2>
        {/* Language selection tabs */}
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          <button
            className={`flex-1 px-4 py-2 text-center rounded-md font-medium transition duration-200 ease-in-out ${langTab === 'ko' ? 'bg-blue-500 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setLangTab('ko')}
          >
            한글 프롬프트
          </button>
          <button
            className={`flex-1 px-4 py-2 text-center rounded-md font-medium transition duration-200 ease-in-out ${langTab === 'en' ? 'bg-blue-500 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setLangTab('en')}
          >
            English Prompt
          </button>
        </div>
        {/* Textarea to display the generated prompt */}
        <textarea
          readOnly
          className="w-full h-60 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-base resize-none focus:outline-none focus:border-blue-500"
          value={buildPrompt(langTab)}
          placeholder={langTab === 'ko' ? '여기에 생성된 프롬프트가 표시됩니다.' : 'Generated prompt will appear here.'}
        />
        {/* Action buttons - Centered */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
          <Button onClick={() => copyToClipboard(buildPrompt(langTab))}>
            {langTab === 'ko' ? '프롬프트 복사' : 'Copy Prompt'}
          </Button>
          <Button onClick={() => downloadFile(langTab === 'ko' ? 'prompt_ko.txt' : 'prompt_en.txt', buildPrompt(langTab))}>
            {langTab === 'ko' ? '프롬프트 다운로드' : 'Download Prompt'}
          </Button>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
}
