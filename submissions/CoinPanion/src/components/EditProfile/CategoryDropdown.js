import React from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const categories = [
  'None',
  'Developer',
  'Video & Film',
  'Podcasts',
  'Comics',
  'Comedy',
  'Crafts & DIY',
  'Music',
  'Drawing & Painting',
  'Games',
  'Science',
  'Dance & Theater',
  'Writing',
  'Animation',
  'Photography',
  'Education',
  'Other'
]

const CategoryDropDown = ({ value, onChange }) =>
  <div>
    <SelectField floatingLabelText="Category" value={value} onChange={onChange} maxHeight={200}>
      {categories.map((category, index) => <MenuItem key={index} value={category} primaryText={category} />)}
    </SelectField>
  </div>

export default CategoryDropDown
