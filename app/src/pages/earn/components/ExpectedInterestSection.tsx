import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { aUST, Luna, u, UST } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { demicrofy } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { AnimateNumber } from '@libs/ui';
import {Typography, styled} from '@material-ui/core';
import big, { Big } from 'big.js';
import {useRewards} from 'pages/mypage/logics/useRewards';
import React, { useMemo, useState } from 'react';
import { useBalances } from 'contexts/balances';
import { useFormatters } from '@anchor-protocol/formatter';
import {
    formatUST,
    formatUSTWithPostfixUnits,
    MILLION,
} from '@anchor-protocol/notation';
export interface ExpectedInterestSectionProps {
  className?: string;
}

export type Period = 'total' | 'year' | 'month' | 'week' | 'day';

interface Item {
  label: string;
  value: Period;
}

const tabItems: Item[] = [
  {
    label: 'YEAR',
    value: 'year',
  },
  {
    label: 'MONTH',
    value: 'month',
  },
  {
    label: 'WEEK',
    value: 'week',
  },
  {
    label: 'DAY',
    value: 'day',
  },
];

export function ExpectedInterestSection({
  className,
}: ExpectedInterestSectionProps) {

  const [tab, setTab] = useState<Item>(() => tabItems[0]);
  const {xyzLunaAsUST, xyzUST} = useRewards();

  const {
        ust: {formatOutput, demicrofy, symbol},
        // native: {formatOutput, demicrofy, symbol},
    } = useFormatters();

    const getDays =(tab: Item) => {
        
        return (tab.value === 'month'
          ? 30
          : tab.value === 'week'
          ? 7
          : tab.value === 'day'
          ? 1
          : 365)
    }

  const expectedInterest = useMemo(() => {
    let answer = 0
    const lunaRate = 0.000509863;
    const ustRate = 0.000955342;

    const balances = [{balance: xyzUST, rate: ustRate},{balance: xyzLunaAsUST, rate: lunaRate}];
    balances.map( (item) => {
    const days = getDays(tab);
    const start = Number(item.balance);
    console.log(start)
    let runningTotal = Number(item.balance); 
    console.log(runningTotal)
    var i = 0;
    while (i <= days) {
        runningTotal += ( runningTotal * item.rate)
        i++
    }
    return answer += (runningTotal-start);    
    
    })
    //setInterestEarnedResult((runningTotal - start).toFixed(2))
        
    return big(answer).div(1000000)

  }, [
    xyzLunaAsUST,
    xyzUST,
    tab
  ]);

  return (
    <Section className={className}>
    <div style={{display:"flex"}}>
        <Typography style={{fontWeight:"860",fontSize:20 ,width:465}}>
          EXPECTED INTEREST BASED ON YOUR DEPOSIT{' '}
        </Typography>
        <InfoTooltip style={{alignSelf:'bottom', marginTop: '5px', fontSize:'20px'}}>
          Estimated interest calculated in UST based on  your UST/LUNA deposit for the selected period

        </InfoTooltip>
    </div>
      <div className="amount">
        <span style={{fontWeight:860}}>
        <AnimateNumber format={formatUST}>
        {expectedInterest.toFixed(2).toString()}
        </AnimateNumber>
          <span className="denom"> UST</span>
        </span>
      </div>

      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={setTab}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
        height={46}
        borderRadius={30}
        fontSize={12}
      />
    </Section>
  );
}
