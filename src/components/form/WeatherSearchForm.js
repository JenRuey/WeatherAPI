import _ from "lodash";
import React from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import data from "../../assets/json/city.list.json";
import EditorInput from "../form-assist/EditorInput";

const city = _.map(data, (o) => o.name);
const country = _.map(data, (o) => o.country);

function WeatherSearchForm({ onSubmit }) {
  const { register, handleSubmit, formState, setValue } = useForm();

  React.useEffect(() => {}, []);

  const updateValue = (name, value) => {
    setValue(name, value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col lg={4}>
          <EditorInput
            label={"City"}
            register={register("City", { required: true })}
            errors={formState.errors}
            suggestion={city}
            setValue={updateValue}
          />
        </Col>
        <Col lg={4}>
          <EditorInput
            label={"Country"}
            register={register("Country", { required: false })}
            errors={formState.errors}
            suggestion={country}
            setValue={updateValue}
          />
        </Col>
        <Col lg={4}>
          <div className={"d-flex"}>
            <Button variant={"info"} type={"submit"} className={"py-1"}>
              {"Submit"}
            </Button>
            <Button
              variant={"dark"}
              className={"py-1 mx-2"}
              onClick={() => {
                updateValue("City", "");
                updateValue("Country", "");
              }}
            >
              {"Clear"}
            </Button>
          </div>
        </Col>
      </Row>
    </form>
  );
}

export default WeatherSearchForm;
