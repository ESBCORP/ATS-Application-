import { useEffect, useRef } from 'react';

export default function ContinuousScrollTestimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const speed = 0.5;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollLeft = 1;
    let animationId: number;

    const smoothScroll = () => {
      if (!container) return;
      container.scrollLeft += speed;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 1;
      }

      animationId = requestAnimationFrame(smoothScroll);
    };

    animationId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
  };

  const cards = [
    {
      letter: 'T',
      color: 'blue',
      name: 'TechCorp Inc.',
      sector: 'Technology Sector',
      quote:
        'VirtuosoU has revolutionized our hiring process. The AI-powered video interviews have saved us countless hours and helped us find better candidates faster. Our time-to-hire has decreased by 35%.',
      title: 'CTO, TechCorp',
    },
    {
      letter: 'G',
      color: 'green',
      name: 'Global Staffing Solutions',
      sector: 'Staffing & Recruiting',
      quote:
        "The workflow automation features have increased our team's productivity by 40%. We're able to place candidates faster and with better matches than ever before. Our clients are thrilled with the results.",
      title: 'CEO, Global Staffing',
    },
    {
      letter: 'F',
      color: 'purple',
      name: 'Future Health',
      sector: 'Healthcare',
      quote:
        'The analytics and reporting features give us insights we never had before. We\'ve been able to optimize our entire recruitment strategy based on real data and improve our hiring outcomes significantly.',
      title: 'HR Director, Future Health',
    },
    {
      letter: 'E',
      color: 'red',
      name: 'EduWorld',
      sector: 'EdTech',
      quote:
        'VirtuosoU helped us simplify academic role screening. A total game-changer for our onboarding workflow across departments.',
      title: 'Director, EduWorld',
    },
    {
      letter: 'B',
      color: 'amber',
      name: 'BuildRight Constructions',
      sector: 'Construction',
      quote:
        'We hire skilled labor 2x faster now with automated assessments and video interviews. It’s completely changed our recruitment speed.',
      title: 'Ops Head, BuildRight',
    },
    {
      letter: 'M',
      color: 'pink',
      name: 'MedPlus Pharma',
      sector: 'Pharmaceuticals',
      quote:
        'Our HR screening time is cut in half. VirtuosoU makes smart hiring seamless, especially with the AI evaluations and custom question flows.',
      title: 'Talent Lead, MedPlus',
    },
  ];

  const duplicatedCards = [...cards, ...cards];

  return (
    <div className="container px-6 mx-auto">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <div className="inline-block px-3 py-1 mb-3 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
          Success Stories
        </div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Trusted by Leading Companies
        </h2>
        <p className="text-xl text-gray-600">
          See what our customers have to say about how VirtuosoU has transformed their recruitment process.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="flex space-x-6 w-max">
          {duplicatedCards.map((card, i) => {
            const colors = colorMap[card.color] || colorMap.blue;

            return (
              <div
                key={i}
                className="w-[300px] flex-shrink-0 p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-14 h-14 mr-4 rounded-full flex items-center justify-center ${colors.bg}`}
                    >
                      <span className={`text-xl font-bold ${colors.text}`}>
                        {card.letter}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{card.name}</h4>
                      <p className={`text-sm font-medium ${colors.text}`}>{card.sector}</p>
                    </div>
                  </div>

                  <p className="mb-4 italic text-gray-700 leading-relaxed whitespace-normal break-words">
                    “{card.quote}”
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, starIndex) => (
                      <svg
                        key={starIndex}
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927a1 1 0 011.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.97 0 1.372 1.24.589 1.81l-2.8 2.034a1 1 0 00-.365 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.365-1.118L2.98 8.72c-.783-.57-.38-1.81.589-1.81h3.46a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{card.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}