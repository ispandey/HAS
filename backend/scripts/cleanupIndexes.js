#!/usr/bin/env node
/**
 * Utility script to prune redundant MongoDB indexes that were created by legacy schemas.
 * Run this once after deploying the updated backend models to ensure a clean index state.
 *
 * Usage:
 *   node scripts/cleanupIndexes.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const TARGET_COLLECTIONS = [
  { name: 'universities', key: { name: 1 }, removeWhen: (index) => !index.unique },
  { name: 'colleges', key: { name: 1 }, removeWhen: () => true },
  { name: 'departments', key: { name: 1 }, removeWhen: () => true }
];

const serializeKey = (key) => JSON.stringify(key);

async function dropRedundantIndex(collection, index) {
  await collection.dropIndex(index.name);
  console.log(`✓ Dropped redundant index ${index.name} on ${collection.collectionName} (${serializeKey(index.key)})`);
}

async function pruneCollectionIndexes(db, { name, key, removeWhen }) {
  const collection = db.collection(name);
  try {
    const indexes = await collection.indexes();
    const targetIndexes = indexes.filter((index) => serializeKey(index.key) === serializeKey(key));

    for (const idx of targetIndexes) {
      if (removeWhen(idx)) {
        await dropRedundantIndex(collection, idx);
      }
    }
  } catch (error) {
    if (error.codeName === 'NamespaceNotFound') {
      console.log(`Skipping ${name}: collection does not exist yet.`);
    } else {
      throw error;
    }
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/habs';
  console.log('Connecting to MongoDB...');

  const connection = await mongoose.connect(mongoUri);
  const { db } = connection.connection;

  try {
    for (const target of TARGET_COLLECTIONS) {
      await pruneCollectionIndexes(db, target);
    }
    console.log('Index cleanup complete.');
  } catch (error) {
    console.error('Index cleanup failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
