'use client';
import "./../globals.css";
import { useEffect, useState } from "react";

const Profile = (props) => {
  const myProfile = props.user === props.profile
  const result = (<div>{myProfile ? 'muj profil' : 'czyjs profil'}
  </div>)
  return (result);
};

export default Profile;
