/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCompanyDetails } from "../../redux/dataCompany/dataCompanyUtils";
import { getLastMonthIncome, getIncomes } from "../../services/companyDetails";

import { Chart } from "../Chart";
import { DateRange } from "../DateRange";
import { withLoading } from "../withLoading";

const CompanyDetails = ({ basicData: { id, city, name }, openModal }) => {
  const [lastMonthIncome, setLastMonthIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [averageIncome, setAverageIncome] = useState(0);
  const [monthIncomes, setMonthIncomes] = useState([]);

  const dispatch = useDispatch();

  const incomes = useSelector(store => store.companyDetails.incomes);
  const startDate = useSelector(store => store.companyDetails.startDate);
  const stopDate = useSelector(store => store.companyDetails.stopDate);

  useEffect(() => {
    if (openModal && !incomes.length) {
      dispatch(fetchCompanyDetails(id));
    }
  }, []);

  useEffect(() => {
    if (openModal) {
      getLastMonthIncome(incomes).then(sum => setLastMonthIncome(sum));
    }
  }, [incomes]);

  useEffect(() => {
    if (openModal)
      getIncomes(startDate, stopDate, incomes).then(
        ({ totalIncome, averageIncome, filteredIncomes }) => {
          setTotalIncome(totalIncome);
          setAverageIncome(averageIncome);
          setMonthIncomes(filteredIncomes);
        }
      );
  }, [startDate, stopDate, incomes]);

  const renderIncome = (income, text) => {
    return (
      <div className="company-details__incomes income">
        <p>{text} INCOME</p>
        <p>{income}</p>
      </div>
    );
  };

  return (
    <div className="company-details">
      <h2>DETAILS</h2>
      <div className="company-details__header">
        <p>ID</p>
        <p>NAME</p>
        <p>CITY</p>
      </div>
      <div className="company-details__basic-info">
        <p>{id}</p>
        <p>{name}</p>
        <p>{city}</p>
      </div>
      <div className="company-details__incomes">
        {renderIncome(totalIncome, "TOTAL")}
        {renderIncome(averageIncome, "AVERAGE")}
        {renderIncome(lastMonthIncome, "LAST MONTH ")}
      </div>
      <DateRange />
      <Chart incomes={monthIncomes} />
    </div>
  );
};

const companyDetailsWithLoading = withLoading(CompanyDetails);
export { companyDetailsWithLoading as CompanyDetails };
