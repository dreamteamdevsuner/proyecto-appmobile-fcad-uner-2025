import { View, Text } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-paper'

const JobsyHeader = ({ headerTitle }: { headerTitle: string }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Icon size={15} source={'star-circle'} color={'black'}></Icon>
      <Text> {headerTitle} </Text>
    </View>
  )
}

export default JobsyHeader