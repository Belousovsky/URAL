import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchParts } from '../api/partsApi'

// Этап 1: Получение списка производителей по артикулу
export const searchManufacturers = createAsyncThunk(
  'parts/searchManufacturers',
  async (number, { rejectWithValue }) => {
    try {
      const cleanNumber = number.trim()
      if (!cleanNumber) return rejectWithValue('Введите артикул детали')

      const data = await fetchParts({ number: cleanNumber })
      const goods = data.goods || []

      // Фильтруем пустые результаты согласно спецификации
      const validGoods = goods.filter(
        (g) => g.brand && g.goodsID !== '00000000-0000-0000-0000-000000000000'
      )

      if (validGoods.length === 0) {
        return rejectWithValue('По данному артикулу производителей не найдено')
      }

      // Получаем уникальных производителей
      const uniqueBrands = Array.from(new Set(validGoods.map((g) => g.brand.trim())))

      return {
        article: cleanNumber,
        manufacturers: uniqueBrands,
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка загрузки производителей')
    }
  }
)

// Этап 2: Получение предложений и аналогов по бренду
export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      const data = await fetchParts({
        number: number.trim(),
        brand: brand.trim(),
        analogues: 'on',
      })

      const goods = data.goods || []
      const validGoods = goods.filter(
        (g) => g.brand && g.goodsID !== '00000000-0000-0000-0000-000000000000'
      )

      if (validGoods.length === 0) {
        return rejectWithValue('Предложений по данному производителю не найдено')
      }

      // Собираем предложения (искомой детали и аналогов) с ценами со складов
      const items = []

      const addItemOffers = (item, isAnalogue) => {
        const warehouses = item.warehouses || []
        if (warehouses.length > 0) {
          warehouses.forEach((w, idx) => {
            items.push({
              id: `${item.goodsID || item.number}_${w.id || idx}`,
              name: item.name || 'Деталь',
              brand: item.brand,
              number: item.number,
              price: w.price ?? null,
              stock: w.stock ?? 0,
              warehouse: w.code || 'Склад',
              isAnalogue,
            })
          })
        } else {
          items.push({
            id: `${item.goodsID || item.number}_none`,
            name: item.name || 'Деталь',
            brand: item.brand,
            number: item.number,
            price: null,
            stock: 0,
            warehouse: 'Нет на складе',
            isAnalogue,
          })
        }
      }

      validGoods.forEach((good) => {
        addItemOffers(good, false)
        if (Array.isArray(good.analogues)) {
          good.analogues.forEach((analogue) => {
            if (analogue.brand) addItemOffers(analogue, true)
          })
        }
      })

      return {
        brand,
        items,
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка загрузки аналогов')
    }
  }
)

const partsSlice = createSlice({
  name: 'parts',
  initialState: {
    article: '',
    selectedBrand: null,
    manufacturers: [],
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    reset(state) {
      state.article = ''
      state.selectedBrand = null
      state.manufacturers = []
      state.items = []
      state.loading = false
      state.error = null
    },
    backToManufacturers(state) {
      state.selectedBrand = null
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Поиск производителей
      .addCase(searchManufacturers.pending, (state) => {
        state.loading = true
        state.error = null
        state.manufacturers = []
        state.selectedBrand = null
        state.items = []
      })
      .addCase(searchManufacturers.fulfilled, (state, action) => {
        state.loading = false
        state.article = action.payload.article
        state.manufacturers = action.payload.manufacturers
      })
      .addCase(searchManufacturers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Поиск аналогов
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true
        state.error = null
        state.items = []
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false
        state.selectedBrand = action.payload.brand
        state.items = action.payload.items
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { reset, backToManufacturers } = partsSlice.actions
export default partsSlice.reducer
