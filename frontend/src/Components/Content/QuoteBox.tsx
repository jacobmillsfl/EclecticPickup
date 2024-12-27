import { useState } from "react";

export type QuoteBoxProps = {
  quote: string
};

export const QuoteBox: React.FC<{ props: QuoteBoxProps }> = ({ props }) => {
    return (
        <div className="layer3">
        <div className="layer3Text">
          <div className="layer3Quote">{props.quote}</div>
        </div>
      </div>
    )
}