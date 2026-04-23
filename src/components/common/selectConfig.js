import { components } from 'react-select';

const DownIcon = '/assets/icons/down.svg';

export const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <img src={DownIcon} alt="down" style={{ width: '12px' }} />
  </components.DropdownIndicator>
);

export const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    background: 'rgba(255, 255, 255, 0.04)',
    border: state.isFocused
      ? '1px solid rgba(2, 223, 130, 0.4)'
      : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    minHeight: '40px',
    height: '40px',
    color: '#fafafa',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: 'none',
    '&:hover': {
      border: state.isFocused
        ? '1px solid rgba(2, 223, 130, 0.4)'
        : '1px solid rgba(255, 255, 255, 0.2)',
    },
    cursor: 'pointer',
    paddingLeft: '6px',
    transition: 'all 0.3s ease',
  }),
  valueContainer: (provided) => ({ ...provided, padding: '0 8px' }),
  singleValue: (provided) => ({ ...provided, color: '#fafafa' }),
  placeholder: (provided) => ({ ...provided, color: 'rgba(255,255,255,0.25)' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: '#fafafa',
    paddingRight: '12px',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
    transition: 'transform 0.3s ease',
  }),
  menu: (provided) => ({
    ...provided,
    background: '#0D1919',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    zIndex: 10000,
    marginTop: '8px',
    padding: '4px',
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected
      ? '#02df82'
      : state.isFocused
        ? 'rgba(2, 223, 130, 0.1)'
        : 'transparent',
    color: state.isSelected ? '#030f0f' : '#fafafa',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '4px',
    margin: '2px 0',
    '&:active': { background: '#02df82', color: '#030f0f' },
    transition: 'all 0.2s ease',
  }),
};
