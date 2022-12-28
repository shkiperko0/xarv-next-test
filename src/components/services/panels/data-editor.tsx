import { ChangeHandler, IDataKey, JSON_Editor } from "@components/dataconstructor"
import { useState } from "react"
import { InteractionProps } from 'react-json-view'
import dynamic from 'next/dynamic'
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const text_scheme: IDataKey = {
  type: 'Array',
  scheme: [
    {
      type: 'Object',
      scheme: {
        changingColor: { type: 'boolean' },
        text: { type: 'string'},
      }
    }
  ]
}

const beveledBlock_scheme: IDataKey = {  
  type: 'Object',
  scheme: {
    title: { type: 'string'},
    background: { type: 'string'},
    text: text_scheme
  }
}

const blockWithPicture_scheme: IDataKey = {  
  type: 'Object',
  scheme: {
    title: { type: 'string'},
    background: { type: 'string'},
    image: { type: 'string'},
    text: text_scheme
  }
}

const registerBlock_scheme: IDataKey = {
  type: 'Object',
  scheme: {
    title: { type: 'string' },
    bg: { type: 'string' }
  }
}

const card_scheme: IDataKey = {
  type: 'Object',
  scheme: {
    id: { type: 'number', },
    title: { type: 'string', },
    subtitle: { type: 'string', },
    text: { type: 'string', },
    url: { type: 'string', },
  }
}

const cardsBlock_scheme: IDataKey = {
  type: 'Object',
  scheme: {
    title: { type: 'string' },
    cards: { 
      type: 'Object',
      scheme: [card_scheme] 
    }
  }
}

const scheme: IDataKey = {
  type: 'Object',
  scheme: {
    beveledBlock: beveledBlock_scheme,
    blockWithPicture: blockWithPicture_scheme,
    cardsBlock: cardsBlock_scheme,
    registerBlock: registerBlock_scheme,
  }
}  

const mock = {
    beveledBlock: {
      title: 'The Reliquary Project',
      background: '/images/backgrounds/reliquary-bg1.webp',
      text: [
        {
          changingColor: true,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque pellentesque volutpat nulla quisque sed.',
        },
        {
          changingColor: false,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis felis tellus fringilla lorem nisi adipiscing. Pharetra pharetra, adipiscing commodo, massa, arcu bibendum ac ultrices. Tortor vehicula ac non purus, ultricies sed morbi nisi. Enim praesent vitae sed id dolor nibh. Augue imperdiet vulputate adipiscing at scelerisque congue purus sit risus. Aliquet risus odio nunc ligula nisl aenean at ultrices porttitor.',
        },
        {
          changingColor: true,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque pellentesque volutpat nulla quisque sed.',
        },
        {
          changingColor: false,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis felis tellus fringilla lorem nisi adipiscing.',
        },
      ]
    },

    blockWithPicture: {
      title: 'Humanity`s Future',
      background: '/images/backgrounds/reliquary-bg1.webp',
      image: '/images/backgrounds/warrior.webp',
      text: [
        {
          changingColor: false,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis felis tellus fringilla lorem nisi adipiscing. Pharetra pharetra, adipiscing ommodo, massa, arcu bibendum ac ultrices. Tortor vehicula ac non purus, ultricies sed morbi nisi.',
  
        },
        {
          changingColor: false,
          text: 'Enim praesent vitae sed id dolor nibh. Augue imperdiet vulputate adipiscing at scelerisque congue purus sit risus. Aliquet risus odio nunc ligula isl aenean at ultrices porttitor.',
        },
        {
          changingColor: true,
          text: 'In 2132, the *Aurora station* project is presented that becomes the first human settlement outside of our Solar System. Its construction begins in 2145. As of now, the *Aurora* is operational, but the construction is still ongoing in different parts of the station.',
        },
      ]
    },

    cardsBlock: {
      title: 'Your Role',
      cards: [
        {
          id: 1,
          title: 'Long Range Bombardment',
          subtitle: 'The Warhawk',
          text: `And that didn’t exclusively apply to combatfocused applications - the Tevarin also utilized airshield technology that redefined now Humans approached capital ships and Despire these profound impacts most Teravin ships and the specifics of their eingenering were thanks to the sweeping destruction of the Purge.`,
          url: '/images/backgrounds/reliq_cards/1.webp',
        },
        {
          id: 2,
          title: 'Long Range Bombardment',
          subtitle: 'The Warhawk',
          text: `And that didn’t exclusively apply to combatfocused applications - the Tevarin also utilized airshield technology that redefined now Humans approached capital ships and Despire these profound impacts most Teravin ships and the specifics of their eingenering were thanks to the sweeping destruction of the Purge.`,
          url: '/images/backgrounds/reliq_cards/2.webp',
        },
        {
          id: 3,
          title: 'Long Range Bombardment',
          subtitle: 'The Warhawk',
          text: `And that didn’t exclusively apply to combatfocused applications - the Tevarin also utilized airshield technology that redefined now Humans approached capital ships and Despire these profound impacts most Teravin ships and the specifics of their eingenering were thanks to the sweeping destruction of the Purge.`,
          url: '/images/backgrounds/reliq_cards/3.webp',
        },
        {
          id: 4,
          title: 'Long Range Bombardment',
          subtitle: 'The Warhawk',
          text: `And that didn’t exclusively apply to combatfocused applications - the Tevarin also utilized airshield technology that redefined now Humans approached capital ships and Despire these profound impacts most Teravin ships and the specifics of their eingenering were thanks to the sweeping destruction of the Purge.`,
          url: '/images/backgrounds/reliq_cards/4.webp',
        },
        {
          id: 5,
          title: 'Long Range Bombardment',
          subtitle: 'The Warhawk',
          text: `And that didn’t exclusively apply to combatfocused applications - the Tevarin also utilized airshield technology that redefined now Humans approached capital ships and Despire these profound impacts most Teravin ships and the specifics of their eingenering were thanks to the sweeping destruction of the Purge.`,
          url: '/images/backgrounds/reliq_cards/5.webp',
        },
      ],
    },
      
    registerBlock: {
      title: 'start your space battle',
      bg: '/images/backgrounds/bg44.webp'
    }
  }

export function DataEditorTest(){
    const [data, setData] = useState<any>(mock)

    const onChange: ChangeHandler = (props: InteractionProps) => {
        setData(props.updated_src)
    }

    return <>
        <ReactJson 
          src={data} 
          onEdit={onChange} 
          onAdd={onChange}
          onDelete={onChange}

          displayObjectSize
          displayDataTypes
        />
        {/* <JSON_Editor data={data} onChange={onChange} scheme={scheme} /> */}
    </>
}