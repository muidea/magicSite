import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import CountUp from 'react-countup'
import styles from './numberCard.less'

function NumberCard({ name, count, countUp }) {
  return (
    <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.content}>
        <p className={styles.title}>{name || 'No Title'}</p>
        <p className={styles.number}>
          <CountUp
            start={0}
            end={count}
            duration={2.75}
            useEasing
            useGrouping
            separator=","
            {...countUp || {}}
          />
        </p>
      </div>
    </Card>
  )
}

NumberCard.propTypes = {
  name: PropTypes.string,
  count: PropTypes.number,
  countUp: PropTypes.object,
}

export default NumberCard
