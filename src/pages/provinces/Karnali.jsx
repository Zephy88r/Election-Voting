import React from 'react';
import ProvinceTemplate from './ProvinceTemplate';

export default function Karnali() {
  return (
    <ProvinceTemplate
      provinceId="karnali"
      provinceLabel="Karnali"
      requiredProvinceName="Karnali"
      heroHint="Only one party vote is allowed per user."
    />
  );
}
