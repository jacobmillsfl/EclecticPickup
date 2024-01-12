import { useState } from "react";

export type QuoteBoxProps = {
  quote: string
};

export const QuoteBox: React.FC<{ props: QuoteBoxProps }> = ({ props }) => {
    const [quote, setQuote] = useState("Dedication To The Groove");

    return (
        <div className="layer3">
        <div className="layer3Text">
          <div className="layer3Quote">{props.quote}</div>
        </div>
      </div>
    )
}