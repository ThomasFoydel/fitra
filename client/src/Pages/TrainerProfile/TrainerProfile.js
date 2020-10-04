import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrainerProfile.scss';

const TrainerProfile = ({ match }) => {
  const [currentTrainer, setCurrentTrainer] = useState({});
  const [startTime, setStartTime] = useState('AUG 25 2020 4:00PM');
  const [endTime, setEndTime] = useState('AUG 25 2020 5:00PM');
  const [day, setDay] = useState();
  const [errMsg, setErrMsg] = useState('');
  useEffect(() => {
    let subscribed = true;
    const { trainerId } = match.params;
    axios
      .get(`/api/client/trainer/${trainerId}`)
      .then(({ data }) => {
        let { trainer, err } = data;
        if (subscribed) setCurrentTrainer(trainer);
      })
      .catch((err) => console.log('trainer profile error: ', err));
    return () => (subscribed = false);
  }, []);

  const bookAppointment = () => {
    // open paypal, upon completion of payment axios post request to server
    // in backend, create new appointment in db
    let token = localStorage.getItem('fitr-token');
    let start = startTime + ':00';
    let end = endTime + ':00';
    const startDate = new Date(day + 'T' + start);
    const startUTC = startDate.toISOString();
    const endDate = new Date(day + 'T' + end);
    const endUTC = endDate.toISOString();
    console.log(' { startTime: startUTC, endTime: endUTC,: ', {
      startTime: startUTC,
      endTime: endUTC,
    });
    axios
      .post(
        '/api/appointment/new',
        { startTime: startUTC, endTime: endUTC, trainer: currentTrainer._id },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then((result) => {
        console.log('booking result: ', result);
      });

    // let offset = new Date().getTimezoneOffset();
  };
  // console.log('thing: ', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log('currentTrainer: ', currentTrainer);
  // trainer bio info week / display of availability
  // selecting time should update state value representing their selection
  // and open modal asking to confirm that it is the time they want
  let { name, bio, email, profilePic, coverPic } = currentTrainer;
  return (
    <div className='trainerprofile'>
      <div
        className='cover-pic'
        style={{
          backgroundImage: coverPic
            ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
            : '',
        }}
      >
        <div className='name'>{name}</div>
        <div className='bio'>{bio}</div>
        <div className='email'>{email}</div>
        <img className='profile-pic' src={`/api/image/${profilePic}`} />

        <input
          type='time'
          onChange={(e) => setStartTime(e.target.value)}
          id='startTime'
          value={startTime}
        />
        <input
          type='time'
          onChange={(e) => setEndTime(e.target.value)}
          id='endTime'
          value={endTime}
        />
        <input type='date' onChange={(e) => setDay(e.target.value)}></input>
        <button onClick={bookAppointment}>book session</button>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
          quod ullam dolorem veniam deserunt reprehenderit, blanditiis nulla
          quasi voluptatem corrupti soluta quisquam at illo architecto esse
          quaerat est tenetur? Sint delectus ullam velit deleniti. Modi, quasi
          laudantium? Dignissimos neque aut nisi sit eum recusandae voluptas
          quibusdam vero libero doloribus sint nihil, corporis pariatur,
          adipisci officiis est velit laboriosam, numquam debitis facere modi
          fuga. Culpa consequatur quisquam ipsum suscipit soluta veniam cum
          similique, recusandae commodi tenetur exercitationem doloremque
          dolores temporibus eveniet asperiores aliquam quam reprehenderit,
          ullam et quod quos porro quidem? Voluptatibus eveniet minima maxime
          qui sequi a commodi voluptatem repellat voluptatum, laborum maiores
          vitae nemo aspernatur nulla laudantium deleniti consectetur cupiditate
          at reprehenderit? Odio, placeat. Voluptatum eum quia harum dignissimos
          delectus ab explicabo sunt qui veritatis, provident, nihil id? Eius
          aliquam asperiores animi esse perferendis, sequi, voluptatibus nihil
          aperiam, laudantium iure fugit consequatur reiciendis? Quos, impedit.
          Harum adipisci explicabo veritatis nisi. Dolorem nisi ab vero,
          deleniti magnam modi rem alias quod consectetur laudantium quas
          tenetur dolorum dicta non maxime eaque, sequi aut repellendus a qui.
          Molestiae numquam nostrum nulla dicta eos minus, reprehenderit eius
          hic odio. Numquam ratione, eveniet iure quod neque in? Illo, soluta.
          Error dignissimos, blanditiis assumenda quis exercitationem ea earum
          odit necessitatibus facilis iure! Sint quis quos, unde architecto
          repudiandae sequi? Delectus nesciunt modi tenetur cum aspernatur ad
          perspiciatis dolor fuga quos consequatur, deserunt placeat quam,
          repellendus repellat numquam ipsam fugit veritatis voluptatibus neque,
          esse saepe? Quos dignissimos, ab eius nisi quidem facilis cumque
          molestiae sapiente itaque deserunt harum, officiis reprehenderit
          accusantium! Tenetur magni id, ex, dolorem error omnis perferendis
          quis repellendus ea eos earum, recusandae labore eum dignissimos. Eos
          dicta nesciunt officiis architecto, perspiciatis aperiam deleniti
          neque libero accusantium voluptatibus fuga explicabo voluptatum. Odio
          porro reprehenderit sequi facilis sed tempora quasi dicta maxime nihil
          deserunt cum nam perspiciatis, magnam nemo exercitationem ipsa
          mollitia accusantium et voluptatibus, asperiores laborum vero aperiam!
          Ipsa sunt vitae qui sapiente nobis dolore eos natus illo, totam
          numquam quis aperiam, debitis officia inventore similique dolor odit
          facilis, officiis non sit aut unde quos? Quibusdam, aliquam quas.
          Fugit, quasi voluptas eligendi fuga dolores debitis asperiores earum
          esse nihil pariatur quis. Quae recusandae deserunt quasi perferendis
          unde harum atque quam possimus iusto corrupti architecto quaerat non
          adipisci, voluptatum maxime explicabo sed provident libero consectetur
          obcaecati, voluptate aspernatur! Impedit error repellendus aliquam
          hic? Dolores repudiandae corrupti in eius cupiditate nesciunt?
          Tempora, debitis? Nisi, quasi ducimus.
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
